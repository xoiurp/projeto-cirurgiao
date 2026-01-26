/**
 * Script para aplicar migration do fórum no banco LOCAL
 * e popular categorias iniciais
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando aplicação da migration do fórum...\n');

  try {
    // Verificar se as tabelas já existem
    const categoriesCount = await prisma.forumCategory.count().catch(() => null);
    
    if (categoriesCount !== null) {
      console.log('✅ Tabelas do fórum já existem!');
      console.log(`📊 Categorias existentes: ${categoriesCount}\n`);
    } else {
      console.log('⚠️  Tabelas do fórum não encontradas.');
      console.log('Execute: npx prisma migrate dev\n');
      process.exit(1);
    }

    // Popular categorias iniciais se não existirem
    if (categoriesCount === 0) {
      console.log('📝 Criando categorias iniciais...\n');

      const categories = [
        {
          name: 'Geral',
          description: 'Discussões gerais sobre a plataforma',
          icon: 'MessageSquare',
          color: '#3B82F6',
          order: 1,
        },
        {
          name: 'Dúvidas Técnicas',
          description: 'Tire suas dúvidas sobre o conteúdo dos cursos',
          icon: 'HelpCircle',
          color: '#8B5CF6',
          order: 2,
        },
        {
          name: 'Sugestões',
          description: 'Compartilhe suas ideias para melhorar a plataforma',
          icon: 'Lightbulb',
          color: '#10B981',
          order: 3,
        },
        {
          name: 'Bugs e Problemas',
          description: 'Reporte problemas técnicos da plataforma',
          icon: 'AlertCircle',
          color: '#EF4444',
          order: 4,
        },
        {
          name: 'Anúncios',
          description: 'Novidades e atualizações da plataforma',
          icon: 'Megaphone',
          color: '#F59E0B',
          order: 5,
        },
      ];

      for (const category of categories) {
        const created = await prisma.forumCategory.create({
          data: category,
        });
        console.log(`✅ Categoria criada: ${created.name}`);
      }

      console.log('\n✨ Categorias iniciais criadas com sucesso!\n');
    } else {
      console.log('ℹ️  Categorias já existem, pulando criação.\n');
    }

    // Estatísticas finais
    const stats = {
      categories: await prisma.forumCategory.count(),
      topics: await prisma.forumTopic.count(),
      replies: await prisma.forumReply.count(),
    };

    console.log('📊 Estatísticas do Fórum:');
    console.log(`   Categorias: ${stats.categories}`);
    console.log(`   Tópicos: ${stats.topics}`);
    console.log(`   Respostas: ${stats.replies}`);
    console.log('\n✅ Migration do fórum aplicada com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao aplicar migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
