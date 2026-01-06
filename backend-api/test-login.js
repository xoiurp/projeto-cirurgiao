const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Testando login...');
  
  const email = 'gustavobressanin6@gmail.com'; // One of the users
  const password = '123456';

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      console.log('Usuário não encontrado.');
      return;
    }

    console.log(`Usuário encontrado: ${user.email}`);
    console.log(`Hash no banco: ${user.password}`);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Senha válida? ${isMatch}`);

    if (isMatch) {
        console.log('Login bem sucedido (simulação).');
    } else {
        console.log('Login falhou.');
    }

  } catch (error) {
    console.error('Erro ao testar login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
