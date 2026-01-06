# PROGRESSO - Deploy em Produção
**Data:** 06 de Janeiro de 2026
**Sessão:** Deploy completo do Frontend e Backend

---

## 📊 Resumo Executivo

### ✅ Frontend - ONLINE!
- **URL:** https://www.projetocirurgiao.app/
- **Hospedagem:** Vercel
- **Domínio Custom:** Configurado

### 🔄 Backend - Em Configuração
- **Imagem Docker:** Build e push com sucesso no Artifact Registry
- **Cloud Run:** Aguardando configuração do banco de dados
- **Cloud SQL:** Instância PostgreSQL sendo criada

---

## 🎯 O que foi feito hoje

### 1. Frontend - Vercel Deploy

#### 1.1 Problemas Resolvidos
- ❌ **Submodule Git:** O `frontend-web` tinha um `.git` interno que causava problemas
  - ✅ **Solução:** Removido `.git` do `frontend-web` e commitado como diretório normal

- ❌ **Vulnerability Next.js 16.x:** Versão experimental com CVE
  - ✅ **Solução:** Downgrade para Next.js 15.3.6 (versão estável)

- ❌ **Zod Schema Error:** `z.coerce.number` não existe
  - ✅ **Solução:** Alterado para `z.number()`

- ❌ **Firebase Faltando:** Dependência não estava no package.json
  - ✅ **Solução:** Adicionado `firebase: ^11.7.1`

#### 1.2 Configurações Criadas
- `vercel.json` com `rootDirectory: frontend-web`
- Variáveis de ambiente no painel Vercel

#### 1.3 Repositório GitHub
- **Conta:** projeto-cirurgiao-marcelo
- **Repo:** https://github.com/projeto-cirurgiao-marcelo/projeto-cirurgiao

---

### 2. Backend - Google Cloud Platform

#### 2.1 Arquivos Criados
```
backend-api/
├── Dockerfile           # Multi-stage build otimizado
├── .dockerignore        # Exclui node_modules, etc
├── .gcloudignore        # Exclui node_modules do upload
└── package.json         # firebase-admin adicionado
```

#### 2.2 Dockerfile Criado
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npx prisma generate
COPY --from=builder /app/dist ./dist
EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080
CMD ["node", "dist/main"]
```

#### 2.3 Permissões IAM Configuradas no GCP
| Service Account | Role |
|----------------|------|
| 81746498042-compute@developer.gserviceaccount.com | roles/storage.objectViewer |
| 81746498042-compute@developer.gserviceaccount.com | roles/artifactregistry.writer |

#### 2.4 APIs Habilitadas
- Cloud Run API
- Cloud Build API
- Artifact Registry API
- Cloud SQL Admin API

#### 2.5 Build da Imagem Docker
- **Status:** ✅ SUCESSO
- **Imagem:** `southamerica-east1-docker.pkg.dev/projeto-cirurgiao-e8df7/cloud-run-source-deploy/projeto-cirurgiao-api`
- **Região:** southamerica-east1 (São Paulo)

---

### 3. Cloud SQL - PostgreSQL

#### 3.1 Instância Sendo Criada
- **Nome:** `cirurgiao-db`
- **Versão:** PostgreSQL 15
- **Tier:** db-f1-micro (~$8/mês)
- **Região:** southamerica-east1
- **Senha:** `ProjetoCirurgiao2026!`

---

## 📋 Próximos Passos

### Imediatos (hoje)
1. [ ] Aguardar criação do Cloud SQL
2. [ ] Criar banco de dados `projeto_cirurgiao`
3. [ ] Deploy do Cloud Run com variáveis de ambiente completas
4. [ ] Rodar migrations do Prisma
5. [ ] Testar backend em produção

### Comandos para continuar:
```bash
# 1. Criar banco de dados (após Cloud SQL pronto)
gcloud sql databases create projeto_cirurgiao --instance=cirurgiao-db --project projeto-cirurgiao-e8df7

# 2. Obter IP da instância
gcloud sql instances describe cirurgiao-db --format="value(ipAddresses[0].ipAddress)" --project projeto-cirurgiao-e8df7

# 3. Deploy do Cloud Run com todas as variáveis
gcloud run deploy projeto-cirurgiao-api \
  --image southamerica-east1-docker.pkg.dev/projeto-cirurgiao-e8df7/cloud-run-source-deploy/projeto-cirurgiao-api \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --project projeto-cirurgiao-e8df7 \
  --set-env-vars "NODE_ENV=production,PORT=8080,CORS_ORIGINS=https://www.projetocirurgiao.app,JWT_SECRET=ef3a103fb59f3af86ac8a91bdc724914f048cd3b19cdb11deb4b92f684e3a9dd,JWT_REFRESH_SECRET=9ade06a039f4db9de6e940d290e6f936d6f45a6a7434b3ea6d7882da86d9b8a7,CLOUDFLARE_ACCOUNT_ID=ad41f4e2927a6daf25f7c7d6891e31bd,CLOUDFLARE_API_TOKEN=atbQzEFtkWsQzg1WldCUqEnzYCH8vu1JVkjTMqgc,CLOUDFLARE_R2_BUCKET=s3-projeto-cirurgiao,CLOUDFLARE_R2_ENDPOINT=https://ad41f4e2927a6daf25f7c7d6891e31bd.r2.cloudflarestorage.com,CLOUDFLARE_STREAM_CUSTOMER_CODE=mcykto8a2uaqo5xu,DATABASE_URL=postgresql://postgres:ProjetoCirurgiao2026@<IP>:5432/projeto_cirurgiao"

# 4. Rodar migrations (localmente conectando ao Cloud SQL)
DATABASE_URL="postgresql://postgres:ProjetoCirurgiao2026!@<IP>:5432/projeto_cirurgiao" npx prisma migrate deploy
```

---

## 💰 Custos Estimados GCP

| Serviço | Free Tier | Custo Estimado |
|---------|-----------|---------------|
| Cloud Run | 2M requests/mês | $0 (dentro do free tier) |
| Cloud SQL (db-f1-micro) | - | ~$8-10/mês |
| Artifact Registry | 500MB | $0 (dentro do free tier) |
| Cloud Build | 120 min/dia | $0 (dentro do free tier) |
| **Total Estimado** | | **~$10/mês** |

---

## 🔒 Segurança

### Secrets/Senhas configuradas:
- **JWT_SECRET:** Armazenado no Cloud Run env vars
- **Cloud SQL Password:** `ProjetoCirurgiao2026!`
- **Cloudflare Tokens:** Armazenados no Cloud Run env vars

### Recomendações futuras:
- [ ] Migrar secrets para Google Secret Manager
- [ ] Usar Cloud SQL Auth Proxy ao invés de IP público
- [ ] Configurar VPC Connector para Cloud Run

---

## 📝 Commits Realizados

```
e16328c - fix: Regenera package-lock.json com firebase-admin
4f0dd9e - fix: Adiciona firebase-admin + .gcloudignore ao backend
9f95cf6 - feat: Adiciona Dockerfile e configura backend para Cloud Run
eb46d63 - fix: Downgrade Next.js para 15.3.3 (resolve vulnerabilidade CVE)
2ade9b2 - fix: Corrige schema do Zod (z.coerce.number -> z.number)
eda9aca - feat: Adiciona firebase como dependência
```

---

## 🌐 URLs do Projeto

| Ambiente | URL | Status |
|----------|-----|--------|
| Frontend (Vercel) | https://www.projetocirurgiao.app | ✅ Online |
| Backend (Cloud Run) | https://projeto-cirurgiao-api-xxx.southamerica-east1.run.app | 🔄 Configurando |
| Swagger API Docs | /api/docs | 🔄 Após deploy |

---

## 📊 Arquitetura Final

```
┌─────────────────────────────────────────────────────────────┐
│                         USUÁRIOS                             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE DNS                            │
│         projetocirurgiao.app → Vercel / Cloud Run           │
└──────────────────────────────┬──────────────────────────────┘
                               │
        ┌──────────────────────┴──────────────────────┐
        ▼                                              ▼
┌───────────────────┐                      ┌───────────────────┐
│   VERCEL          │                      │  GOOGLE CLOUD     │
│   Frontend Web    │                      │  PLATFORM         │
│   Next.js 15.3.6  │◄─────API────────────►│                   │
│                   │                      │  ┌─────────────┐  │
└───────────────────┘                      │  │  Cloud Run  │  │
                                           │  │  NestJS API │  │
                                           │  └──────┬──────┘  │
                                           │         │         │
                                           │  ┌──────▼──────┐  │
                                           │  │  Cloud SQL  │  │
                                           │  │  PostgreSQL │  │
                                           │  └─────────────┘  │
                                           │                   │
                                           │  ┌─────────────┐  │
                                           │  │  Firebase   │  │
                                           │  │  Auth       │  │
                                           │  └─────────────┘  │
                                           └───────────────────┘
                                                    │
                                                    ▼
                                           ┌───────────────────┐
                                           │   CLOUDFLARE      │
                                           │   Stream (vídeos) │
                                           │   R2 (storage)    │
                                           └───────────────────┘
```

---

**Última atualização:** 06/01/2026 17:52
**Autor:** Cline (AI Assistant)
