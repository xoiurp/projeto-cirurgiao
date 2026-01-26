/**
 * Script para aplicar migration de Video Features no Cloud SQL (PRODUÇÃO)
 * 
 * Uso: node apply-video-features-migration-cloud.js
 * 
 * ATENÇÃO: Este script modifica o banco de PRODUÇÃO!
 * Certifique-se de ter as credenciais corretas configuradas.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  // Configuração do Cloud SQL (PRODUÇÃO)
  // Usando conexão via Cloud SQL Proxy ou IP público
  const client = new Client({
    host: process.env.CLOUD_SQL_HOST || '34.95.176.216', // IP do Cloud SQL
    port: 5432,
    database: 'cirurgiao_db',
    user: 'postgres',
    password: process.env.CLOUD_SQL_PASSWORD || 'Marcelo@2025!', // Senha do Cloud SQL
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Conectando ao Cloud SQL (PRODUÇÃO)...');
    console.log('⚠️  ATENÇÃO: Você está modificando o banco de PRODUÇÃO!\n');
    await client.connect();
    console.log('✅ Conectado ao Cloud SQL!\n');

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

    console.log('📊 Tabelas criadas no Cloud SQL:');
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

    console.log('\n🎉 Migration aplicada com sucesso no Cloud SQL (PRODUÇÃO)!');
    console.log('   As novas features do player de vídeo estão disponíveis em produção.');

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️  Algumas tabelas/tipos já existem. Migration pode já ter sido aplicada.');
    } else {
      console.error('❌ Erro ao aplicar migration:', error.message);
      console.error('\nDica: Verifique se:');
      console.error('  1. O IP do Cloud SQL está correto');
      console.error('  2. A senha está correta');
      console.error('  3. Seu IP está autorizado no Cloud SQL');
    }
  } finally {
    await client.end();
    console.log('\n🔌 Conexão encerrada.');
  }
}

// Confirmação antes de executar em produção
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  ⚠️  ATENÇÃO: MIGRATION EM PRODUÇÃO (CLOUD SQL)            ║');
console.log('║                                                            ║');
console.log('║  Este script irá criar as seguintes tabelas:               ║');
console.log('║  - video_likes (Sistema de Curtidas)                       ║');
console.log('║  - video_notes (Sistema de Notas)                          ║');
console.log('║  - video_transcripts (Sistema de Transcrição)              ║');
console.log('║  - video_materials (Material Relacionado)                  ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');

rl.question('Deseja continuar? (digite "sim" para confirmar): ', (answer) => {
  rl.close();
  if (answer.toLowerCase() === 'sim') {
    applyMigration();
  } else {
    console.log('❌ Operação cancelada.');
    process.exit(0);
  }
});
