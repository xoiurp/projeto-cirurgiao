/**
 * Script para aplicar migration de Video Features no banco LOCAL
 * 
 * Uso: node apply-video-features-migration-local.js
 * 
 * Certifique-se de que o Docker está rodando com o PostgreSQL local
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  // Configuração do banco LOCAL (lê do DATABASE_URL ou usa valores padrão)
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'projeto_cirurgiao',
    user: 'postgres',
    password: 'postgres',
  });

  try {
    console.log('🔌 Conectando ao banco de dados LOCAL...');
    await client.connect();
    console.log('✅ Conectado!\n');

    // Ler o arquivo de migration
    const migrationPath = path.join(__dirname, 'prisma/migrations/20260114_add_video_features/migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Aplicando migration de Video Features...\n');
    
    // Executar a migration
    await client.query(migrationSQL);
    
    console.log('✅ Migration aplicada com sucesso!\n');

    // Verificar as tabelas criadas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('video_likes', 'video_notes', 'video_transcripts', 'video_materials')
      ORDER BY table_name;
    `);

    console.log('📊 Tabelas criadas:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    // Verificar o enum criado
    const enums = await client.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typname = 'MaterialType';
    `);

    if (enums.rows.length > 0) {
      console.log('\n📊 Enum criado:');
      console.log('   - MaterialType');
    }

    console.log('\n🎉 Tudo pronto! As novas features do player de vídeo estão disponíveis.');

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️  Algumas tabelas/tipos já existem. Migration pode já ter sido aplicada.');
    } else {
      console.error('❌ Erro ao aplicar migration:', error.message);
    }
  } finally {
    await client.end();
    console.log('\n🔌 Conexão encerrada.');
  }
}

applyMigration();
