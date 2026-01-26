/**
 * Script para aplicar migration de thumbnails em CLOUD (GCP)
 * Adiciona campos thumbnailVertical e thumbnailHorizontal
 */

const { Client } = require('pg');

const SQL_MIGRATION = `
-- Adicionar novos campos à tabela courses
ALTER TABLE "courses" 
ADD COLUMN IF NOT EXISTS "thumbnailVertical" TEXT,
ADD COLUMN IF NOT EXISTS "thumbnailHorizontal" TEXT;

-- Migrar dados existentes do campo thumbnail para thumbnailHorizontal
UPDATE "courses" 
SET "thumbnailHorizontal" = "thumbnail" 
WHERE "thumbnail" IS NOT NULL 
AND "thumbnailHorizontal" IS NULL;
`;

async function applyMigration() {
  // Pega a connection string do ambiente ou usa a padrão do GCP
  const connectionString = process.env.DATABASE_URL_CLOUD || process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ Erro: DATABASE_URL_CLOUD não definida!');
    console.log('\n💡 Defina a variável de ambiente:');
    console.log('export DATABASE_URL_CLOUD="postgresql://user:password@host:5432/database"');
    console.log('\nOu execute:');
    console.log('DATABASE_URL_CLOUD="sua-connection-string" node apply-thumbnail-migration-cloud.js');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Para Cloud SQL do GCP
    }
  });

  try {
    console.log('🔌 Conectando ao banco de dados CLOUD (GCP)...');
    await client.connect();
    console.log('✅ Conectado!');

    console.log('\n📝 Aplicando migration de thumbnails...');
    await client.query(SQL_MIGRATION);
    console.log('✅ Migration aplicada com sucesso!');

    console.log('\n🔍 Verificando estrutura da tabela courses...');
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'courses'
      AND column_name IN ('thumbnail', 'thumbnailVertical', 'thumbnailHorizontal')
      ORDER BY column_name;
    `);

    console.log('\n📊 Campos de thumbnail na tabela:');
    console.table(result.rows);

    console.log('\n✅ Migration CLOUD concluída com sucesso!');
    console.log('🎉 Ambiente de produção atualizado!');

  } catch (error) {
    console.error('\n❌ Erro ao aplicar migration:', error.message);
    console.error('\n💡 Dicas:');
    console.error('- Verifique se a connection string está correta');
    console.error('- Verifique se o IP está liberado no Cloud SQL');
    console.error('- Verifique se o usuário tem permissões ALTER TABLE');
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
