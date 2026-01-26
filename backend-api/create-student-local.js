/**
 * Script para criar student DIRETAMENTE no banco LOCALHOST
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

// Forçar a URL do banco LOCAL
const LOCAL_URL = 'postgresql://postgres:postgres@localhost:5432/projeto_cirurgiao';

const prisma = new PrismaClient({
  datasources: {
    db: { url: LOCAL_URL },
  },
});

const STUDENT_CONFIG = {
  email: 'student@projetocirurgiao.app',
  name: 'Aluno Teste',
  password: 'Aluno123!',
  role: 'STUDENT',
};

async function main() {
  console.log('=== Criando Student no Banco LOCAL ===');
  console.log(`URL: ${LOCAL_URL}\n`);

  try {
    // Primeiro listar todos os usuários
    const existingUsers = await prisma.user.findMany({
      select: { email: true, role: true },
    });
    console.log(`👥 Usuários existentes no banco local: ${existingUsers.length}`);
    existingUsers.forEach(u => console.log(`   - ${u.email} (${u.role})`));

    // Verificar se o student já existe
    const existingStudent = await prisma.user.findUnique({
      where: { email: STUDENT_CONFIG.email },
    });

    if (existingStudent) {
      console.log(`\n⚠️  Student já existe: ${existingStudent.email}`);
      console.log(`   Atualizando senha...`);
      
      // Atualizar senha
      const hashedPassword = await bcrypt.hash(STUDENT_CONFIG.password, 10);
      const updated = await prisma.user.update({
        where: { email: STUDENT_CONFIG.email },
        data: { password: hashedPassword },
      });
      
      console.log(`✅ Senha atualizada com sucesso!`);
      console.log(`\n🔑 Credenciais:`);
      console.log(`   Email: ${STUDENT_CONFIG.email}`);
      console.log(`   Senha: ${STUDENT_CONFIG.password}`);
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(STUDENT_CONFIG.password, 10);

    // Criar o student
    const student = await prisma.user.create({
      data: {
        email: STUDENT_CONFIG.email,
        name: STUDENT_CONFIG.name,
        password: hashedPassword,
        role: STUDENT_CONFIG.role,
        isActive: true,
      },
    });

    console.log('\n✅ Student criado com sucesso no banco LOCAL!');
    console.log(`   ID: ${student.id}`);
    console.log(`   Email: ${student.email}`);
    console.log(`   Role: ${student.role}`);
    console.log(`\n🔑 Credenciais:`);
    console.log(`   Email: ${STUDENT_CONFIG.email}`);
    console.log(`   Senha: ${STUDENT_CONFIG.password}`);

    // Verificar total após criação
    const finalUsers = await prisma.user.findMany({
      select: { email: true, role: true },
    });
    console.log(`\n👥 Total de usuários no banco local agora: ${finalUsers.length}`);
    finalUsers.forEach(u => console.log(`   - ${u.email} (${u.role})`));

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();