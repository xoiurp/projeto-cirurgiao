/**
 * Script para criar ADMIN no Cloud SQL (Produção)
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

// URL do Cloud SQL
const CLOUD_SQL_URL = 'postgresql://postgres:ProjetoCirurgiao2026!@35.199.87.196:5432/projeto_cirurgiao';

const prisma = new PrismaClient({
  datasources: {
    db: { url: CLOUD_SQL_URL },
  },
});

const ADMIN_CONFIG = {
  email: 'admin@projetocirurgiao.app',
  name: 'Administrador',
  password: 'Admin@123456',
  role: 'ADMIN',
};

async function main() {
  console.log('=== Criando/Atualizando ADMIN no Cloud SQL ===');
  console.log(`Email: ${ADMIN_CONFIG.email}\n`);

  try {
    // Primeiro listar todos os usuários
    const existingUsers = await prisma.user.findMany({
      select: { email: true, role: true },
    });
    console.log(`👥 Usuários existentes no Cloud SQL: ${existingUsers.length}`);
    existingUsers.forEach(u => console.log(`   - ${u.email} (${u.role})`));

    // Verificar se o admin já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_CONFIG.email },
    });

    // Hash da senha
    const hashedPassword = await bcrypt.hash(ADMIN_CONFIG.password, 10);

    if (existingAdmin) {
      console.log(`\n⚠️  Admin já existe: ${existingAdmin.email}`);
      console.log(`   Role atual: ${existingAdmin.role}`);
      console.log(`   Atualizando senha e garantindo role ADMIN...`);
      
      // Atualizar senha e role
      const updated = await prisma.user.update({
        where: { email: ADMIN_CONFIG.email },
        data: { 
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true,
        },
      });
      
      console.log(`✅ Admin atualizado com sucesso!`);
      console.log(`   ID: ${updated.id}`);
      console.log(`   Email: ${updated.email}`);
      console.log(`   Role: ${updated.role}`);
    } else {
      // Criar o admin
      const admin = await prisma.user.create({
        data: {
          email: ADMIN_CONFIG.email,
          name: ADMIN_CONFIG.name,
          password: hashedPassword,
          role: ADMIN_CONFIG.role,
          isActive: true,
        },
      });

      console.log('\n✅ Admin criado com sucesso no Cloud SQL!');
      console.log(`   ID: ${admin.id}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
    }

    console.log(`\n🔑 Credenciais para Login:`);
    console.log(`   Email: ${ADMIN_CONFIG.email}`);
    console.log(`   Senha: ${ADMIN_CONFIG.password}`);

    // Verificar total após criação/atualização
    const finalUsers = await prisma.user.findMany({
      select: { email: true, role: true },
    });
    console.log(`\n👥 Total de usuários no Cloud SQL agora: ${finalUsers.length}`);
    
    // Separar por role
    const admins = finalUsers.filter(u => u.role === 'ADMIN');
    const students = finalUsers.filter(u => u.role === 'STUDENT');
    
    console.log(`\n📊 Distribuição:`);
    console.log(`   ADMIN: ${admins.length}`);
    admins.forEach(u => console.log(`      - ${u.email}`));
    console.log(`   STUDENT: ${students.length}`);
    students.forEach(u => console.log(`      - ${u.email}`));

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
