/**
 * Script para criar um usuário STUDENT no Firebase E no banco de dados
 * Cria automaticamente em ambos os sistemas
 * 
 * Uso: 
 *   - Local: node create-student-firebase.js
 *   - Cloud SQL: set DATABASE_URL=postgresql://postgres:ProjetoCirurgiao2026!@35.199.87.196:5432/projeto_cirurgiao && node create-student-firebase.js
 */

const { PrismaClient } = require('@prisma/client');
const admin = require('firebase-admin');
const path = require('path');

const prisma = new PrismaClient();

// Inicializar Firebase Admin
const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
let firebaseInitialized = false;

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin inicializado');
  }
} catch (error) {
  console.log('⚠️  Firebase Admin não pôde ser inicializado:', error.message);
  console.log('   O usuário será criado apenas no banco de dados.\n');
}

// Configuração do novo usuário student
const STUDENT_CONFIG = {
  email: 'student@projetocirurgiao.app',
  name: 'Aluno Teste',
  password: 'Aluno123!',
  role: 'STUDENT',
};

async function main() {
  console.log('=== Criando Usuário Student ===\n');
  
  try {
    // Verificar se o usuário já existe no banco
    const existingUser = await prisma.user.findUnique({
      where: { email: STUDENT_CONFIG.email },
    });

    if (existingUser) {
      console.log('❌ Usuário já existe no banco!');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}`);
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Firebase UID: ${existingUser.firebaseUid || '(não definido)'}`);
      return;
    }

    let firebaseUid = null;

    // Criar usuário no Firebase
    if (firebaseInitialized) {
      try {
        // Verificar se já existe no Firebase
        try {
          const existingFirebaseUser = await admin.auth().getUserByEmail(STUDENT_CONFIG.email);
          console.log('⚠️  Usuário já existe no Firebase');
          console.log(`   UID: ${existingFirebaseUser.uid}`);
          firebaseUid = existingFirebaseUser.uid;
        } catch (notFoundError) {
          // Usuário não existe, criar
          const firebaseUser = await admin.auth().createUser({
            email: STUDENT_CONFIG.email,
            password: STUDENT_CONFIG.password,
            displayName: STUDENT_CONFIG.name,
            emailVerified: true, // Para testes
          });
          console.log('✅ Usuário criado no Firebase');
          console.log(`   UID: ${firebaseUser.uid}`);
          firebaseUid = firebaseUser.uid;
        }
      } catch (firebaseError) {
        console.error('❌ Erro ao criar no Firebase:', firebaseError.message);
      }
    }

    // Criar usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        email: STUDENT_CONFIG.email,
        name: STUDENT_CONFIG.name,
        password: 'firebase-auth', // Não usamos senha local com Firebase Auth
        role: STUDENT_CONFIG.role,
        isActive: true,
      },
    });

    console.log('\n✅ Usuário criado com sucesso no banco!\n');
    console.log('📋 Dados do usuário:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nome: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Firebase UID: ${user.firebaseUid || '(não definido)'}`);
    
    console.log('\n🔑 Credenciais para login:');
    console.log(`   Email: ${STUDENT_CONFIG.email}`);
    console.log(`   Senha: ${STUDENT_CONFIG.password}`);
    
    console.log('\n🌐 Acesse: https://www.projetocirurgiao.app/login');
    console.log('   Use as credenciais acima para fazer login como STUDENT');

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
