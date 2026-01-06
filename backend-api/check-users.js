const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Conectando ao banco de dados...');
  
  try {
    const users = await prisma.user.findMany();
    console.log(`Encontrados ${users.length} usuários.`);

    for (const user of users) {
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`IsActive: ${user.isActive}`);
      console.log(`Password Hash (first 20 chars): ${user.password.substring(0, 20)}...`);
      console.log('-------------------');
    }
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
