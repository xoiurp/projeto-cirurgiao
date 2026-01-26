const { execSync } = require('child_process');

// Configurar DATABASE_URL
process.env.DATABASE_URL = 'postgresql://postgres:789152@35.199.87.196:5432/projeto_cirurgiao?sslmode=require';

console.log('🚀 Aplicando migrations no Cloud SQL...\n');
console.log('DATABASE_URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
console.log('');

try {
  // Aplicar migrations
  console.log('📦 Aplicando migrations...');
  execSync('npx prisma migrate deploy', { 
    stdio: 'inherit',
    env: process.env
  });
  
  console.log('\n✅ Migrations aplicadas com sucesso!');
  
  // Gerar Prisma Client
  console.log('\n🔧 Gerando Prisma Client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: process.env
  });
  
  console.log('\n✅ Prisma Client gerado com sucesso!');
  console.log('\n🎉 Deploy concluído!');
  
} catch (error) {
  console.error('\n❌ Erro ao aplicar migrations:', error.message);
  process.exit(1);
}