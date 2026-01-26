/**
 * Script para aplicar TODAS as migrations do Prisma no Cloud SQL (Produção)
 * 
 * Este script:
 * 1. Conecta ao Cloud SQL via DATABASE_URL de produção
 * 2. Aplica todas as migrations pendentes
 * 3. Gera o Prisma Client atualizado
 * 
 * IMPORTANTE: Execute este script APENAS quando tiver certeza de que
 * todas as migrations locais estão funcionando corretamente.
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Cores para o terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, colors.bright + colors.cyan);
  console.log('='.repeat(60) + '\n');
}

function executeCommand(command, description) {
  try {
    log(`\n▶ ${description}...`, colors.blue);
    const output = execSync(command, { 
      encoding: 'utf-8',
      stdio: 'inherit'
    });
    log(`✓ ${description} - Concluído!`, colors.green);
    return true;
  } catch (error) {
    log(`✗ Erro ao ${description}`, colors.red);
    console.error(error.message);
    return false;
  }
}

async function confirmAction(question) {
  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${question} (s/N): ${colors.reset}`, (answer) => {
      resolve(answer.toLowerCase() === 's' || answer.toLowerCase() === 'sim');
    });
  });
}

async function main() {
  logSection('🚀 APLICAR TODAS AS MIGRATIONS NO CLOUD SQL (PRODUÇÃO)');

  log('Este script irá aplicar TODAS as migrations do Prisma no banco de dados de produção.', colors.yellow);
  log('\nMigrations que serão aplicadas:', colors.bright);
  log('  1. 20251109081640_init', colors.cyan);
  log('  2. 20251119214805_add_courses_modules_videos', colors.cyan);
  log('  3. 20251126182818_make_cloudflare_url_optional', colors.cyan);
  log('  4. 20251126190703_add_video_upload_status', colors.cyan);
  log('  5. 20251203174016_enhance_progress_model', colors.cyan);
  log('  6. 20251212172018_add_video_progress_model', colors.cyan);
  log('  7. 20260109105513_add_video_embed_fields', colors.cyan);
  log('  8. 20260113_add_thumbnail_orientations', colors.cyan);
  log('  9. 20260114_add_video_features', colors.cyan);
  log(' 10. 20260115_add_forum', colors.cyan);

  log('\n⚠️  ATENÇÃO:', colors.red + colors.bright);
  log('  • Este script modificará o banco de dados de PRODUÇÃO', colors.red);
  log('  • Certifique-se de ter um backup recente', colors.red);
  log('  • Verifique se a DATABASE_URL está configurada corretamente', colors.red);

  const confirmed = await confirmAction('\n\nDeseja continuar?');
  
  if (!confirmed) {
    log('\n❌ Operação cancelada pelo usuário.', colors.yellow);
    rl.close();
    process.exit(0);
  }

  logSection('📋 VERIFICANDO CONFIGURAÇÃO');

  // Verificar se DATABASE_URL está configurada
  if (!process.env.DATABASE_URL) {
    log('❌ DATABASE_URL não está configurada!', colors.red);
    log('\nConfigure a variável de ambiente DATABASE_URL com a connection string do Cloud SQL:', colors.yellow);
    log('export DATABASE_URL="postgresql://USER:PASSWORD@/DATABASE?host=/cloudsql/PROJECT:REGION:INSTANCE"', colors.cyan);
    rl.close();
    process.exit(1);
  }

  log('✓ DATABASE_URL configurada', colors.green);
  log(`  ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`, colors.cyan);

  const finalConfirm = await confirmAction('\n\nConfirma que esta é a DATABASE_URL CORRETA de produção?');
  
  if (!finalConfirm) {
    log('\n❌ Operação cancelada. Verifique a DATABASE_URL e tente novamente.', colors.yellow);
    rl.close();
    process.exit(0);
  }

  logSection('🔄 APLICANDO MIGRATIONS');

  // Aplicar todas as migrations
  const success = executeCommand(
    'npx prisma migrate deploy',
    'Aplicando todas as migrations pendentes'
  );

  if (!success) {
    log('\n❌ Falha ao aplicar migrations!', colors.red);
    log('Verifique os erros acima e tente novamente.', colors.yellow);
    rl.close();
    process.exit(1);
  }

  logSection('🔧 GERANDO PRISMA CLIENT');

  // Gerar Prisma Client
  executeCommand(
    'npx prisma generate',
    'Gerando Prisma Client atualizado'
  );

  logSection('✅ PROCESSO CONCLUÍDO COM SUCESSO!');

  log('Todas as migrations foram aplicadas no banco de dados de produção.', colors.green);
  log('\nPróximos passos:', colors.bright);
  log('  1. Verifique se o backend está funcionando corretamente', colors.cyan);
  log('  2. Teste as funcionalidades principais', colors.cyan);
  log('  3. Crie um usuário admin se necessário:', colors.cyan);
  log('     node create-admin-cloud.js', colors.yellow);
  log('  4. Monitore os logs do Cloud Run para erros', colors.cyan);

  rl.close();
}

// Executar o script
main().catch((error) => {
  log('\n❌ Erro inesperado:', colors.red);
  console.error(error);
  rl.close();
  process.exit(1);
});