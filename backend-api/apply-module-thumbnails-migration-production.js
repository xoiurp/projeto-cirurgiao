const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Credenciais do Cloud SQL
const DATABASE_URL_CLOUD = 'postgresql://postgres:789152@35.199.87.196:5432/projeto_cirurgiao';

async function applyMigration() {
  console.log('🚀 Aplicando migration de thumbnails de módulos no banco de PRODUÇÃO...\n');
  console.log('⚠️  ATENÇÃO: Esta operação será executada no banco de PRODUÇÃO!');
  console.log(`🔗 Conectando ao banco: ${DATABASE_URL_CLOUD.replace(/:[^:]*@/, ':****@')}\n`);

  const client = new Client({
    connectionString: DATABASE_URL_CLOUD,
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de produção!\n');

    // Ler o arquivo de migration
    const migrationPath = path.join(__dirname, 'prisma', 'migrations', '20260126_add_module_thumbnails', 'migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Conteúdo da migration:');
    console.log('─'.repeat(50));
    console.log(migrationSQL);
    console.log('─'.repeat(50));
    console.log('');

    // Aguardar 3 segundos
    console.log('⏳ Aguardando 3 segundos antes de continuar...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Executar cada comando SQL separadamente
    const commands = [
      'ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "thumbnail" TEXT',
      'ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "thumbnailVertical" TEXT',
      'ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "thumbnailHorizontal" TEXT'
    ];

    console.log('⚙️  Executando migration...');
    for (const command of commands) {
      console.log(`   Executando: ${command}...`);
      await client.query(command);
      console.log('   ✅ Sucesso!');
    }

    console.log('\n🎉 Migration aplicada com sucesso no banco de PRODUÇÃO!');
    
    // Verificar se as colunas foram criadas
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'modules'
      AND column_name IN ('thumbnail', 'thumbnailVertical', 'thumbnailHorizontal')
      ORDER BY column_name;
    `);

    console.log('\n📊 Colunas criadas:');
    console.log('─'.repeat(50));
    result.rows.forEach(col => {
      console.log(`✅ ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
    });
    console.log('─'.repeat(50));

    // Contar módulos
    const countResult = await client.query('SELECT COUNT(*) as count FROM modules');
    console.log(`\n📦 Total de módulos no banco: ${countResult.rows[0].count}`);

  } catch (error) {
    console.error('❌ Erro ao aplicar migration:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão fechada.');
  }
}

applyMigration()
  .then(() => {
    console.log('\n✅ Processo concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });