const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyColumns() {
  console.log('🔍 Verificando colunas de thumbnail na tabela modules...\n');

  try {
    // Consultar a estrutura da tabela
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'modules'
      AND column_name IN ('thumbnail', 'thumbnailVertical', 'thumbnailHorizontal')
      ORDER BY column_name;
    `;

    console.log('📊 Colunas encontradas:');
    console.log('─'.repeat(60));
    
    if (result.length === 0) {
      console.log('❌ Nenhuma coluna de thumbnail encontrada!');
      console.log('\n⚠️  A migration NÃO foi aplicada.');
      return false;
    }

    result.forEach(col => {
      console.log(`✅ ${col.column_name}`);
      console.log(`   Tipo: ${col.data_type}`);
      console.log(`   Nullable: ${col.is_nullable}`);
      console.log('');
    });

    console.log('─'.repeat(60));
    console.log(`\n✅ ${result.length}/3 colunas encontradas`);
    
    if (result.length === 3) {
      console.log('\n🎉 Migration aplicada com SUCESSO!');
      
      // Verificar se há módulos no banco
      const moduleCount = await prisma.module.count();
      console.log(`\n📦 Total de módulos no banco: ${moduleCount}`);
      
      if (moduleCount > 0) {
        // Mostrar exemplo de um módulo
        const sampleModule = await prisma.module.findFirst({
          select: {
            id: true,
            title: true,
            thumbnail: true,
            thumbnailVertical: true,
            thumbnailHorizontal: true,
          }
        });
        
        console.log('\n📝 Exemplo de módulo:');
        console.log(JSON.stringify(sampleModule, null, 2));
      }
      
      return true;
    } else {
      console.log(`\n⚠️  Apenas ${result.length}/3 colunas encontradas. Migration incompleta!`);
      return false;
    }

  } catch (error) {
    console.error('❌ Erro ao verificar colunas:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

verifyColumns()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });