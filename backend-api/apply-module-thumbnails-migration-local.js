const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Aplicando migration de thumbnails de módulos no banco LOCAL...\n');

  try {
    // Ler o arquivo SQL da migration
    const migrationPath = path.join(
      __dirname,
      'prisma',
      'migrations',
      '20260126_add_module_thumbnails',
      'migration.sql'
    );

    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Conteúdo da migration:');
    console.log('─'.repeat(50));
    console.log(migrationSQL);
    console.log('─'.repeat(50));
    console.log('');

    // Executar a migration - cada comando separadamente
    console.log('⚙️  Executando migration...');
    
    const commands = [
      'ALTER TABLE "modules" ADD COLUMN "thumbnail" TEXT',
      'ALTER TABLE "modules" ADD COLUMN "thumbnailVertical" TEXT',
      'ALTER TABLE "modules" ADD COLUMN "thumbnailHorizontal" TEXT'
    ];

    for (const command of commands) {
      console.log(`   Executando: ${command.substring(0, 50)}...`);
      await prisma.$executeRawUnsafe(command);
    }

    console.log('✅ Migration aplicada com sucesso!\n');

    // Verificar as colunas adicionadas
    console.log('🔍 Verificando estrutura da tabela modules...');
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'modules'
      AND column_name IN ('thumbnail', 'thumbnailVertical', 'thumbnailHorizontal')
      ORDER BY column_name;
    `;

    console.log('\n📊 Colunas de thumbnail adicionadas:');
    console.table(result);

    console.log('\n✨ Processo concluído com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Execute: cd backend-api && npx prisma generate');
    console.log('2. Reinicie o servidor backend');
    console.log('3. Teste o upload de thumbnails de módulos\n');

  } catch (error) {
    console.error('❌ Erro ao aplicar migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();