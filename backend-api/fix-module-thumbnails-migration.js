const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Corrigindo colunas de thumbnails de módulos...\n');

  try {
    // Verificar quais colunas existem
    console.log('🔍 Verificando colunas existentes...');
    const existingColumns = await prisma.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'modules'
      AND column_name IN ('thumbnail', 'thumbnailVertical', 'thumbnailHorizontal');
    `;

    const existing = existingColumns.map(col => col.column_name);
    console.log('📊 Colunas existentes:', existing);

    // Adicionar apenas as colunas que faltam
    const columnsToAdd = [
      { name: 'thumbnail', sql: 'ALTER TABLE "modules" ADD COLUMN "thumbnail" TEXT' },
      { name: 'thumbnailVertical', sql: 'ALTER TABLE "modules" ADD COLUMN "thumbnailVertical" TEXT' },
      { name: 'thumbnailHorizontal', sql: 'ALTER TABLE "modules" ADD COLUMN "thumbnailHorizontal" TEXT' }
    ];

    for (const column of columnsToAdd) {
      if (!existing.includes(column.name)) {
        console.log(`➕ Adicionando coluna: ${column.name}`);
        await prisma.$executeRawUnsafe(column.sql);
        console.log(`✅ Coluna ${column.name} adicionada!`);
      } else {
        console.log(`⏭️  Coluna ${column.name} já existe, pulando...`);
      }
    }

    // Verificar resultado final
    console.log('\n🔍 Verificando estrutura final...');
    const finalColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'modules'
      AND column_name IN ('thumbnail', 'thumbnailVertical', 'thumbnailHorizontal')
      ORDER BY column_name;
    `;

    console.log('\n📊 Colunas de thumbnail:');
    console.table(finalColumns);

    console.log('\n✨ Processo concluído com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Reinicie o servidor backend');
    console.log('2. Teste o upload de thumbnails de módulos\n');

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();