/**
 * Script para atualizar a senha do usuário STUDENT
 * 
 * Uso: 
 *   set DATABASE_URL=postgresql://postgres:ProjetoCirurgiao2026!@35.199.87.196:5432/projeto_cirurgiao && node backend-api/update-student-password.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const STUDENT_EMAIL = 'student@projetocirurgiao.app';
const NEW_PASSWORD = 'Aluno123!';

async function main() {
  console.log('=== Atualizando Senha do Student ===\n');
  
  try {
    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: STUDENT_EMAIL },
    });

    if (!user) {
      console.log(`❌ Usuário ${STUDENT_EMAIL} não encontrado!`);
      return;
    }

    console.log(`📋 Usuário encontrado:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Senha atual (primeiros 20 chars): ${user.password.substring(0, 20)}...`);

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

    // Atualizar senha
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    console.log(`\n✅ Senha atualizada com sucesso!`);
    console.log(`\n🔑 Novas credenciais:`);
    console.log(`   Email: ${STUDENT_EMAIL}`);
    console.log(`   Senha: ${NEW_PASSWORD}`);
    console.log(`\n🌐 Acesse: https://www.projetocirurgiao.app/login`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();