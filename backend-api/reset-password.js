const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Conectando ao banco de dados...');
  
  try {
    const users = await prisma.user.findMany();
    console.log(`Encontrados ${users.length} usuários.`);

    if (users.length === 0) {
      console.log('Nenhum usuário encontrado.');
      return;
    }

    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10);

    for (const user of users) {
      console.log(`Atualizando senha para usuário: ${user.email} (${user.role})`);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    }

    console.log('Senhas atualizadas com sucesso para "123456".');
  } catch (error) {
    console.error('Erro ao atualizar senhas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
