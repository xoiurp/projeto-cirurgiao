/**
 * Script para aplicar migration de thumbnails em LOCALHOST
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
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/projeto_cirurgiao'
  });

  try {
    console.log('🔌 Conectando ao banco de dados LOCAL...');
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

    console.log('\n✅ Migration LOCAL concluída com sucesso!');
    console.log('🎉 Agora você pode salvar thumbnails no formulário de edição!');

  } catch (error) {
    console.error('\n❌ Erro ao aplicar migration:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
