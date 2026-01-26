/**
 * Script para criar student DIRETAMENTE no Cloud SQL
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

// Forçar a URL do Cloud SQL
const CLOUD_SQL_URL = 'postgresql://postgres:ProjetoCirurgiao2026!@35.199.87.196:5432/projeto_cirurgiao';

const prisma = new PrismaClient({
  datasources: {
    db: { url: CLOUD_SQL_URL },
  },
});

const STUDENT_CONFIG = {
  email: 'student@projetocirurgiao.app',
  name: 'Aluno Teste',
  password: 'Aluno123!',
  role: 'STUDENT',
};

async function main() {
  console.log('=== Criando Student no Cloud SQL ===');
  console.log(`URL: ${CLOUD_SQL_URL.substring(0, 50)}...\n`);

  try {
    // Primeiro listar todos os usuários
    const existingUsers = await prisma.user.findMany({
      select: { email: true, role: true },
    });
    console.log(`👥 Usuários existentes no Cloud SQL: ${existingUsers.length}`);
    existingUsers.forEach(u => console.log(`   - ${u.email} (${u.role})`));

    // Verificar se o student já existe
    const existingStudent = await prisma.user.findUnique({
      where: { email: STUDENT_CONFIG.email },
    });

    if (existingStudent) {
      console.log(`\n❌ Student já existe: ${existingStudent.email}`);
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

    console.log('\n✅ Student criado com sucesso no Cloud SQL!');
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
    console.log(`\n👥 Total de usuários no Cloud SQL agora: ${finalUsers.length}`);
    finalUsers.forEach(u => console.log(`   - ${u.email} (${u.role})`));

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();