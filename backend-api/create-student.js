/**
 * Script para criar um usuário STUDENT no banco de dados
 * 
 * IMPORTANTE: Como usamos Firebase Auth, o usuário precisa ser criado no Firebase primeiro.
 * Este script cria apenas o registro no PostgreSQL.
 * 
 * Passos:
 * 1. Crie o usuário no Firebase Console (https://console.firebase.google.com)
 *    ou use o Firebase Admin SDK
 * 2. Copie o UID do Firebase
 * 3. Execute este script com o UID
 * 
 * Uso: 
 *   - Local: node create-student.js
 *   - Cloud SQL: set DATABASE_URL=postgresql://postgres:ProjetoCirurgiao2026!@35.199.87.196:5432/projeto_cirurgiao && node create-student.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Configuração do novo usuário student
const STUDENT_CONFIG = {
  email: 'student@projetocirurgiao.app',
  name: 'Aluno Teste',
  password: 'Aluno123!', // Será hasheada
  role: 'STUDENT',
  // Se você já criou o usuário no Firebase, coloque o UID aqui:
  firebaseUid: null, // Ex: 'abc123xyz456'
};

async function main() {
  console.log('=== Criando Usuário Student ===\n');
  
  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: STUDENT_CONFIG.email },
    });

    if (existingUser) {
      console.log('❌ Usuário já existe!');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}`);
      console.log(`   ID: ${existingUser.id}`);
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(STUDENT_CONFIG.password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: STUDENT_CONFIG.email,
        name: STUDENT_CONFIG.name,
        password: hashedPassword,
        role: STUDENT_CONFIG.role,
        firebaseUid: STUDENT_CONFIG.firebaseUid,
        isActive: true,
      },
    });

    console.log('✅ Usuário criado com sucesso!\n');
    console.log('📋 Dados do usuário:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nome: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Firebase UID: ${user.firebaseUid || '(não definido)'}`);
    console.log(`   Senha: ${STUDENT_CONFIG.password}`);
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   Se você ainda não criou o usuário no Firebase:');
    console.log('   1. Acesse: https://console.firebase.google.com');
    console.log('   2. Vá em Authentication > Users > Add user');
    console.log(`   3. Use o email: ${STUDENT_CONFIG.email}`);
    console.log(`   4. Use a senha: ${STUDENT_CONFIG.password}`);
    console.log('   5. Copie o UID e atualize o usuário no banco');

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();