const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Usar a URL do banco de dados em produção
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_PROD || process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log('🚀 Aplicando migration de thumbnails de módulos no banco CLOUD...\n');
  console.log('⚠️  ATENÇÃO: Esta operação será executada no banco de PRODUÇÃO!\n');

  // Verificar se a URL de produção está configurada
  const dbUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL_PROD ou DATABASE_URL não está configurada!');
  }

  console.log('🔗 Conectando ao banco:', dbUrl.replace(/:[^:@]+@/, ':****@'));
  console.log('');

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

    // Confirmar antes de executar
    console.log('⚠️  Você está prestes a modificar o banco de PRODUÇÃO!');
    console.log('⏳ Aguardando 5 segundos antes de continuar...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));

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

    // Contar módulos existentes
    const moduleCount = await prisma.module.count();
    console.log(`\n📈 Total de módulos no banco: ${moduleCount}`);

    console.log('\n✨ Processo concluído com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Faça deploy da nova versão do backend');
    console.log('2. Teste o upload de thumbnails de módulos em produção');
    console.log('3. Monitore os logs para garantir que tudo está funcionando\n');

  } catch (error) {
    console.error('❌ Erro ao aplicar migration:', error);
    console.error('\n⚠️  IMPORTANTE: Verifique o estado do banco de dados!');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();