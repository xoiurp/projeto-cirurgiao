# 🔧 GUIA DE CONFIGURAÇÃO CLOUDFLARE

## 📋 Visão Geral

Este guia explica como obter e configurar as credenciais do Cloudflare Stream e R2 necessárias para o funcionamento completo da aplicação.

---

## 🎥 CLOUDFLARE STREAM (Vídeos)

### 1. Criar Conta Cloudflare

1. Acesse: https://dash.cloudflare.com/sign-up
2. Crie uma conta gratuita ou faça login

### 2. Obter Account ID

1. Faça login no dashboard: https://dash.cloudflare.com
2. No menu lateral, clique em **"Stream"**
3. Se for a primeira vez, aceite os termos
4. No canto superior direito, você verá seu **Account ID**
5. Copie este ID

### 3. Criar API Token

1. Clique no ícone do seu perfil (canto superior direito)
2. Vá em **"My Profile"** → **"API Tokens"**
3. Clique em **"Create Token"**
4. Escolha **"Create Custom Token"**
5. Configure as permissões:
   - **Token name**: `Projeto Cirurgião - Stream`
   - **Permissions**:
     - Account → Stream → Edit
     - Account → Stream → Read
6. Clique em **"Continue to summary"**
7. Clique em **"Create Token"**
8. **IMPORTANTE**: Copie o token imediatamente (ele só será mostrado uma vez)

### 4. Configurar no .env

Abra o arquivo `backend-api/.env` e substitua:

```env
CLOUDFLARE_ACCOUNT_ID="seu_account_id_aqui"
CLOUDFLARE_API_TOKEN="seu_api_token_aqui"
```

---

## 📦 CLOUDFLARE R2 (Storage)

### 1. Ativar R2

1. No dashboard Cloudflare: https://dash.cloudflare.com
2. No menu lateral, clique em **"R2"**
3. Se for a primeira vez, clique em **"Purchase R2"**
4. Escolha o plano gratuito (10GB grátis)

### 2. Criar Bucket

1. Na página do R2, clique em **"Create bucket"**
2. Configure:
   - **Bucket name**: `projeto-cirurgiao`
   - **Location**: Automatic (ou escolha uma região)
3. Clique em **"Create bucket"**

### 3. Obter Access Keys

1. Na página do R2, clique em **"Manage R2 API Tokens"**
2. Clique em **"Create API token"**
3. Configure:
   - **Token name**: `Projeto Cirurgião - R2`
   - **Permissions**: 
     - Object Read & Write
   - **Specify bucket(s)**: Selecione `projeto-cirurgiao`
4. Clique em **"Create API Token"**
5. **IMPORTANTE**: Copie as credenciais:
   - Access Key ID
   - Secret Access Key
   - (Elas só serão mostradas uma vez)

### 4. Obter Account ID do R2

1. Na página do R2, você verá o **Account ID** no topo
2. Copie este ID (pode ser o mesmo do Stream)

### 5. Configurar no .env

Abra o arquivo `backend-api/.env` e substitua:

```env
CLOUDFLARE_R2_ACCOUNT_ID="seu_account_id_aqui"
CLOUDFLARE_R2_ACCESS_KEY_ID="sua_access_key_id_aqui"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="sua_secret_access_key_aqui"
CLOUDFLARE_R2_BUCKET_NAME="projeto-cirurgiao"
```

---

## 📝 EXEMPLO DE .env COMPLETO

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/projeto_cirurgiao"

# JWT
JWT_SECRET="projeto-cirurgiao-jwt-secret-key-2024"
JWT_EXPIRATION="15m"
JWT_REFRESH_SECRET="projeto-cirurgiao-refresh-secret-key-2024"
JWT_REFRESH_EXPIRATION="7d"

# Application
PORT=3000
NODE_ENV=development
API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"

# CORS
CORS_ORIGINS="http://localhost:3001,http://localhost:3000"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# LOGGING
LOG_LEVEL="debug"

# Cloudflare Stream
CLOUDFLARE_ACCOUNT_ID="a1b2c3d4e5f6g7h8i9j0"
CLOUDFLARE_API_TOKEN="abcdefghijklmnopqrstuvwxyz1234567890"

# Cloudflare R2
CLOUDFLARE_R2_ACCOUNT_ID="a1b2c3d4e5f6g7h8i9j0"
CLOUDFLARE_R2_ACCESS_KEY_ID="1234567890abcdef"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="abcdefghijklmnopqrstuvwxyz1234567890abcdef"
CLOUDFLARE_R2_BUCKET_NAME="projeto-cirurgiao"
```

---

## 🧪 TESTAR CONFIGURAÇÃO

### 1. Reiniciar o Backend

```bash
cd backend-api
npm run start:dev
```

### 2. Verificar Logs

Se tudo estiver correto, você verá:

```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] CloudflareModule dependencies initialized
[Nest] LOG [RoutesResolver] CoursesController {/api/v1/courses}
[Nest] LOG [RoutesResolver] VideosController {/api/v1/videos}
[Nest] LOG [NestApplication] Nest application successfully started
```

### 3. Testar Upload de Vídeo

Você pode testar fazendo uma requisição para obter URL de upload:

```bash
curl -X POST http://localhost:3000/api/v1/videos/upload-url \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

Resposta esperada:
```json
{
  "uploadUrl": "https://upload.videodelivery.net/...",
  "uid": "abc123..."
}
```

---

## 🔒 SEGURANÇA

### ⚠️ IMPORTANTE

1. **NUNCA** commite o arquivo `.env` no Git
2. **NUNCA** compartilhe suas API tokens publicamente
3. Use `.env.example` para documentar as variáveis necessárias
4. Em produção, use variáveis de ambiente do servidor

### Criar .env.example

```bash
cd backend-api
cp .env .env.example
```

Edite `.env.example` e substitua os valores reais por placeholders:

```env
CLOUDFLARE_ACCOUNT_ID="your_account_id_here"
CLOUDFLARE_API_TOKEN="your_api_token_here"
# etc...
```

---

## 💰 CUSTOS

### Cloudflare Stream (Plano Gratuito)
- **Armazenamento**: Primeiros 1.000 minutos grátis
- **Visualizações**: Primeiras 10.000 visualizações grátis
- **Depois**: $1/1.000 minutos armazenados + $1/1.000 minutos visualizados

### Cloudflare R2 (Plano Gratuito)
- **Armazenamento**: 10 GB grátis
- **Operações Classe A**: 1 milhão/mês grátis
- **Operações Classe B**: 10 milhões/mês grátis
- **Egress**: Grátis (sem cobrança de saída de dados)

---

## 🆘 TROUBLESHOOTING

### Erro: "Cloudflare credentials not configured"

**Solução**: Verifique se todas as variáveis estão no `.env`:
- CLOUDFLARE_ACCOUNT_ID
- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_R2_ACCOUNT_ID
- CLOUDFLARE_R2_ACCESS_KEY_ID
- CLOUDFLARE_R2_SECRET_ACCESS_KEY
- CLOUDFLARE_R2_BUCKET_NAME

### Erro: "Invalid API token"

**Solução**: 
1. Verifique se o token foi copiado corretamente
2. Verifique se o token tem as permissões corretas
3. Crie um novo token se necessário

### Erro: "Bucket not found"

**Solução**:
1. Verifique se o bucket foi criado no R2
2. Verifique se o nome do bucket está correto no `.env`
3. Verifique se o token tem acesso ao bucket

### Erro: "Account ID mismatch"

**Solução**:
1. Verifique se está usando o Account ID correto
2. O Account ID do Stream e R2 devem ser o mesmo (da sua conta)

---

## 📚 LINKS ÚTEIS

- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Documentação Stream**: https://developers.cloudflare.com/stream/
- **Documentação R2**: https://developers.cloudflare.com/r2/
- **API Tokens**: https://dash.cloudflare.com/profile/api-tokens
- **Pricing Stream**: https://www.cloudflare.com/products/cloudflare-stream/
- **Pricing R2**: https://www.cloudflare.com/products/r2/

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

- [ ] Conta Cloudflare criada
- [ ] Cloudflare Stream ativado
- [ ] Account ID copiado
- [ ] API Token do Stream criado
- [ ] Cloudflare R2 ativado
- [ ] Bucket R2 criado
- [ ] Access Keys do R2 criadas
- [ ] Todas as variáveis adicionadas ao `.env`
- [ ] Backend reiniciado
- [ ] Configuração testada
- [ ] `.env.example` criado
- [ ] `.env` adicionado ao `.gitignore`

---

**Pronto!** Agora sua aplicação está configurada para fazer upload e streaming de vídeos! 🎉
