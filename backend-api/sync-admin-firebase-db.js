/**
 * Script para SINCRONIZAR usuário ADMIN entre Firebase e PostgreSQL
 * Cria no Firebase E no banco de dados local
 */

const admin = require('firebase-admin');
const { PrismaClient } = require('@prisma/client');
const serviceAccount = require('./firebase-service-account.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const prisma = new PrismaClient();

const ADMIN_CONFIG = {
  email: 'admin@projetocirurgiao.app',
  password: 'Admin@123456',
  displayName: 'Administrador',
  role: 'ADMIN',
};

async function main() {
  console.log('=== Sincronizando ADMIN: Firebase + PostgreSQL ===\n');
  console.log(`Email: ${ADMIN_CONFIG.email}`);
  console.log(`Role: ${ADMIN_CONFIG.role}\n`);

  try {
    // ========================================
    // PASSO 1: Firebase Authentication
    // ========================================
    console.log('📱 PASSO 1: Firebase Authentication');
    let firebaseUser;
    
    try {
      firebaseUser = await admin.auth().getUserByEmail(ADMIN_CONFIG.email);
      console.log(`   ✅ Usuário já existe no Firebase`);
      console.log(`   UID: ${firebaseUser.uid}`);
      
      // Atualizar senha
      await admin.auth().updateUser(firebaseUser.uid, {
        password: ADMIN_CONFIG.password,
        displayName: ADMIN_CONFIG.displayName,
      });
      console.log(`   ✅ Senha atualizada`);
      
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`   📝 Criando usuário no Firebase...`);
        firebaseUser = await admin.auth().createUser({
          email: ADMIN_CONFIG.email,
          password: ADMIN_CONFIG.password,
          displayName: ADMIN_CONFIG.displayName,
          emailVerified: true,
        });
        console.log(`   ✅ Usuário criado no Firebase`);
        console.log(`   UID: ${firebaseUser.uid}`);
      } else {
        throw error;
      }
    }

    // ========================================
    // PASSO 2: PostgreSQL Database
    // ========================================
    console.log(`\n💾 PASSO 2: PostgreSQL Database`);
    
    let dbUser = await prisma.user.findUnique({
      where: { email: ADMIN_CONFIG.email },
    });

    if (dbUser) {
      console.log(`   ✅ Usuário já existe no banco`);
      console.log(`   ID: ${dbUser.id}`);
      console.log(`   Role atual: ${dbUser.role}`);
      
      // Atualizar role se necessário
      if (dbUser.role !== ADMIN_CONFIG.role) {
        console.log(`   📝 Atualizando role para ${ADMIN_CONFIG.role}...`);
        dbUser = await prisma.user.update({
          where: { email: ADMIN_CONFIG.email },
          data: { 
            role: ADMIN_CONFIG.role,
            name: ADMIN_CONFIG.displayName,
            isActive: true,
          },
        });
        console.log(`   ✅ Role atualizada`);
      }
    } else {
      console.log(`   📝 Criando usuário no banco...`);
      dbUser = await prisma.user.create({
        data: {
          email: ADMIN_CONFIG.email,
          name: ADMIN_CONFIG.displayName,
          password: '', // Firebase gerencia a senha
          role: ADMIN_CONFIG.role,
          isActive: true,
        },
      });
      console.log(`   ✅ Usuário criado no banco`);
      console.log(`   ID: ${dbUser.id}`);
    }

    // ========================================
    // RESUMO FINAL
    // ========================================
    console.log(`\n✅ SINCRONIZAÇÃO COMPLETA!\n`);
    console.log(`📊 Resumo:`);
    console.log(`   Firebase UID: ${firebaseUser.uid}`);
    console.log(`   Database ID: ${dbUser.id}`);
    console.log(`   Email: ${dbUser.email}`);
    console.log(`   Nome: ${dbUser.name}`);
    console.log(`   Role: ${dbUser.role}`);
    console.log(`   Ativo: ${dbUser.isActive}`);
    
    console.log(`\n🔑 Credenciais para Login:`);
    console.log(`   Email: ${ADMIN_CONFIG.email}`);
    console.log(`   Senha: ${ADMIN_CONFIG.password}`);
    
    console.log(`\n💡 Agora você pode fazer login normalmente!`);
    console.log(`   O sistema usará Firebase Auth + PostgreSQL sincronizados.`);

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
    await admin.app().delete();
  }
}

main();
