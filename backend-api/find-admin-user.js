/**
 * Script para encontrar o usuário admin@projetocirurgiao.app
 */

const { PrismaClient } = require('@prisma/client');

async function main() {
  console.log('=== Buscando admin@projetocirurgiao.app ===\n');

  // Tentar com diferentes DATABASE_URLs
  const urls = [
    process.env.DATABASE_URL,
    'postgresql://postgres:ProjetoCirurgiao2026!@35.199.87.196:5432/projeto_cirurgiao',
    'postgresql://postgres:ProjetoCirurgiao2026!@35.199.87.196:5432/postgres',
  ];

  for (const url of urls) {
    if (!url) continue;
    
    console.log(`\n📁 Testando: ${url.substring(0, 50)}...`);
    
    const prisma = new PrismaClient({
      datasources: {
        db: { url },
      },
    });

    try {
      // Buscar especificamente admin@projetocirurgiao.app
      const admin = await prisma.user.findUnique({
        where: { email: 'admin@projetocirurgiao.app' },
      });

      if (admin) {
        console.log('✅ ENCONTRADO!');
        console.log(`   ID: ${admin.id}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
      } else {
        console.log('❌ Não encontrado');
      }

      // Listar todos os usuários
      const users = await prisma.user.findMany({
        select: { email: true, role: true },
      });
      console.log(`\n👥 Total de usuários: ${users.length}`);
      users.forEach(u => console.log(`   - ${u.email} (${u.role})`));

    } catch (error) {
      console.error(`   Erro: ${error.message}`);
    } finally {
      await prisma.$disconnect();
    }
  }
}

main();