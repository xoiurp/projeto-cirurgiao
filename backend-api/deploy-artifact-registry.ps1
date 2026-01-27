# Script de Deploy para Artifact Registry - PowerShell
# Execute este script do diretório backend-api

Write-Host "=== Deploy para GCP Artifact Registry ===" -ForegroundColor Cyan
Write-Host ""

# 1. Habilitar APIs
Write-Host "1. Habilitando APIs necessárias..." -ForegroundColor Yellow
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao habilitar APIs" -ForegroundColor Red
    exit 1
}

Write-Host "APIs habilitadas com sucesso!" -ForegroundColor Green
Write-Host ""

# 2. Criar repositório (pode falhar se já existir, mas tudo bem)
Write-Host "2. Criando repositório no Artifact Registry..." -ForegroundColor Yellow
gcloud artifacts repositories create cirurgiao-api `
    --repository-format=docker `
    --location=southamerica-east1 `
    --description="Repositório Docker para API do Cirurgião" 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Repositório criado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Repositório já existe (OK)" -ForegroundColor Yellow
}
Write-Host ""

# 3. Configurar autenticação Docker
Write-Host "3. Configurando autenticação Docker..." -ForegroundColor Yellow
gcloud auth configure-docker southamerica-east1-docker.pkg.dev --quiet

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao configurar Docker" -ForegroundColor Red
    exit 1
}

Write-Host "Docker configurado com sucesso!" -ForegroundColor Green
Write-Host ""

# 4. Build da imagem
Write-Host "4. Fazendo build da imagem Docker..." -ForegroundColor Yellow
Write-Host "   Isso pode levar alguns minutos..." -ForegroundColor Gray

gcloud builds submit `
    --tag southamerica-east1-docker.pkg.dev/projeto-cirurgiao-e8df7/cirurgiao-api/api:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no build da imagem" -ForegroundColor Red
    exit 1
}

Write-Host "Build concluído com sucesso!" -ForegroundColor Green
Write-Host ""

# 5. Deploy no Cloud Run
Write-Host "5. Fazendo deploy no Cloud Run..." -ForegroundColor Yellow

gcloud run deploy cirurgiao-api `
    --image southamerica-east1-docker.pkg.dev/projeto-cirurgiao-e8df7/cirurgiao-api/api:latest `
    --region southamerica-east1 `
    --platform managed `
    --allow-unauthenticated `
    --memory 512Mi `
    --cpu 1 `
    --max-instances 10

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no deploy" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Deploy concluído com sucesso! ===" -ForegroundColor Green
Write-Host ""

# 6. Obter URL do serviço
Write-Host "Obtendo URL do serviço..." -ForegroundColor Yellow
$serviceUrl = gcloud run services describe cirurgiao-api `
    --region southamerica-east1 `
    --format="value(status.url)"

Write-Host ""
Write-Host "URL do serviço: $serviceUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Teste o serviço:" -ForegroundColor Yellow
Write-Host "  curl $serviceUrl/health" -ForegroundColor Gray
Write-Host ""