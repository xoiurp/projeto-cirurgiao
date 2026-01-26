/**
 * Script para criar usuário ADMIN no Firebase Authentication
 */

const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const ADMIN_CONFIG = {
  email: 'admin@projetocirurgiao.app',
  password: 'Admin@123456',
  displayName: 'Administrador',
};

async function main() {
  console.log('=== Criando/Atualizando ADMIN no Firebase Authentication ===');
  console.log(`Email: ${ADMIN_CONFIG.email}\n`);

  try {
    // Verificar se usuário já existe
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(ADMIN_CONFIG.email);
      console.log(`⚠️  Usuário já existe no Firebase`);
      console.log(`   UID: ${userRecord.uid}`);
      console.log(`   Email: ${userRecord.email}`);
      console.log(`   Atualiz ando senha...`);
      
      // Atualizar senha
      await admin.auth().updateUser(userRecord.uid, {
        password: ADMIN_CONFIG.password,
        displayName: ADMIN_CONFIG.displayName,
      });
      
      console.log(`✅ Senha atualizada com sucesso!`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Criar novo usuário
        console.log('📝 Criando novo usuário no Firebase...');
        userRecord = await admin.auth().createUser({
          email: ADMIN_CONFIG.email,
          password: ADMIN_CONFIG.password,
          displayName: ADMIN_CONFIG.displayName,
          emailVerified: true, // Marcar email como verificado
        });
        
        console.log(`✅ Usuário criado com sucesso no Firebase!`);
        console.log(`   UID: ${userRecord.uid}`);
        console.log(`   Email: ${userRecord.email}`);
      } else {
        throw error;
      }
    }

    console.log(`\n🔑 Credenciais para Login:`);
    console.log(`   Email: ${ADMIN_CONFIG.email}`);
    console.log(`   Senha: ${ADMIN_CONFIG.password}`);
    
    console.log(`\n💡 Agora você pode fazer login com estas credenciais!`);
    console.log(`   O sistema usará Firebase Auth para autenticação.`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  } finally {
    // Encerrar app Firebase
    await admin.app().delete();
  }
}

main();
