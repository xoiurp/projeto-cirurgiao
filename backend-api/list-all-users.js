/**
 * Script para listar todos os usuários de TODOS os databases
 */

const { Client } = require('pg');

const DATABASES = ['projeto_cirurgiao', 'postgres'];
const CONNECTION = {
  host: '35.199.87.196',
  port: 5432,
  user: 'postgres',
  password: 'ProjetoCirurgiao2026!',
};

async function main() {
  console.log('=== Listando usuários de todos os databases ===\n');

  for (const database of DATABASES) {
    console.log(`\n📁 Database: ${database}`);
    console.log('='.repeat(50));

    const client = new Client({
      ...CONNECTION,
      database,
    });

    try {
      await client.connect();

      // Verificar se a tabela User existe
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name ILIKE '%user%'
      `);

      console.log('Tabelas com "user" no nome:', tablesResult.rows);

      // Tentar buscar usuários da tabela User
      try {
        const usersResult = await client.query('SELECT id, email, name, role, "isActive" FROM "User"');
        console.log(`\n👥 Encontrados ${usersResult.rows.length} usuários:\n`);
        for (const user of usersResult.rows) {
          console.log(`   - ${user.email} (${user.role}) - Active: ${user.isActive}`);
        }
      } catch (e) {
        console.log('   Tabela "User" não encontrada ou erro:', e.message);
      }

    } catch (error) {
      console.error(`   Erro ao conectar: ${error.message}`);
    } finally {
      await client.end();
    }
  }
}

main();