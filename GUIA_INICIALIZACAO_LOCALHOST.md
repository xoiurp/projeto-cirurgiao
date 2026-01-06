# 🚀 GUIA DE INICIALIZAÇÃO DO PROJETO EM LOCALHOST

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação Inicial](#instalação-inicial)
3. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
4. [Configuração do Backend](#configuração-do-backend)
5. [Configuração do Frontend](#configuração-do-frontend)
6. [Iniciando o Projeto](#iniciando-o-projeto)
7. [Testando a Aplicação](#testando-a-aplicação)
8. [Troubleshooting](#troubleshooting)
9. [Comandos Úteis](#comandos-úteis)

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Obrigatórios:
- **Node.js** (versão 20.x ou superior)
  - Download: https://nodejs.org/
  - Verificar: `node --version`
  
- **npm** (vem com Node.js) ou **yarn**
  - Verificar: `npm --version`
  
- **Docker Desktop** (para PostgreSQL e Redis)
  - Download: https://www.docker.com/products/docker-desktop
  - Verificar: `docker --version` e `docker-compose --version`

### Recomendados:
- **Git** (para controle de versão)
  - Download: https://git-scm.com/
  - Verificar: `git --version`
  
- **Visual Studio Code** (IDE recomendada)
  - Download: https://code.visualstudio.com/

---

## 📦 Instalação Inicial

### 1. Clone o Repositório

```bash
git clone https://github.com/xoiurp/projeto-cirurgiao.git
cd projeto-cirurgiao
```

### 2. Estrutura do Projeto

```
projeto-cirurgiao/
├── backend-api/          # API NestJS
├── frontend-web/         # Frontend Next.js
├── docker-compose.yml    # Configuração Docker
├── scripts/              # Scripts auxiliares
└── docs/                 # Documentação
```

---

## 🗄️ Configuração do Banco de Dados

### 1. Iniciar Serviços Docker

O projeto usa Docker para PostgreSQL, Redis e pgAdmin:

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar se os containers estão rodando
docker-compose ps
```

**Serviços disponíveis:**
- **PostgreSQL**: `localhost:5432`
  - Database: `projeto_cirurgiao`
  - User: `postgres`
  - Password: `postgres`
  
- **Redis**: `localhost:6379`
  - Password: `redis_dev_password`
  
- **pgAdmin**: `http://localhost:5050`
  - Email: `admin@projetocirurgiao.com`
  - Password: `admin`

### 2. Verificar Conexão com PostgreSQL

```bash
# Usando Docker
docker exec -it projeto-cirurgiao-postgres psql -U postgres -d projeto_cirurgiao

# Dentro do psql, testar:
\dt  # Listar tabelas (ainda vazio)
\q   # Sair
```

---

## ⚙️ Configuração do Backend

### 1. Navegar para o diretório do backend

```bash
cd backend-api
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie o arquivo `.env` baseado no `.env.example`:

```bash
# Windows (PowerShell)
Copy-Item ..\.env.example .env

# Linux/Mac
cp ../.env.example .env
```

**Edite o arquivo `.env` com as configurações mínimas:**

```env
# DATABASE
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/projeto_cirurgiao"

# JWT (use valores seguros em produção)
JWT_SECRET="dev_secret_key_change_in_production_123456789"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="dev_refresh_secret_key_change_in_production_987654321"
REFRESH_TOKEN_EXPIRES_IN="7d"

# APPLICATION
NODE_ENV="development"
PORT="3000"
API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"

# CORS
CORS_ORIGINS="http://localhost:3001,http://localhost:3000"

# REDIS (opcional para desenvolvimento inicial)
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD="redis_dev_password"

# LOGGING
LOG_LEVEL="debug"
```

### 4. Configurar Prisma e Banco de Dados

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Executar migrations (criar tabelas)
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio para visualizar dados
npm run prisma:studio
```

**Prisma Studio** abrirá em `http://localhost:5555`

### 5. Testar o Backend

```bash
# Iniciar em modo desenvolvimento
npm run start:dev
```

**Você deve ver:**
```
[Nest] 12345  - 19/11/2025, 18:30:00     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 19/11/2025, 18:30:00     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 19/11/2025, 18:30:00     LOG [RoutesResolver] AuthController {/api/v1/auth}:
[Nest] 12345  - 19/11/2025, 18:30:00     LOG [RouterExplorer] Mapped {/api/v1/auth/register, POST} route
[Nest] 12345  - 19/11/2025, 18:30:00     LOG [RouterExplorer] Mapped {/api/v1/auth/login, POST} route
[Nest] 12345  - 19/11/2025, 18:30:00     LOG [NestApplication] Nest application successfully started
[Nest] 12345  - 19/11/2025, 18:30:00     LOG Application is running on: http://localhost:3000
```

**Testar endpoint de health:**
```bash
# Em outro terminal
curl http://localhost:3000/api/v1/health
```

---

## 🎨 Configuração do Frontend

### 1. Abrir Novo Terminal e Navegar para o Frontend

```bash
# A partir da raiz do projeto
cd frontend-web
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local`:

```bash
# Windows (PowerShell)
Copy-Item ..\.env.local.example .env.local

# Linux/Mac
cp ../.env.local.example .env.local
```

**Edite o arquivo `.env.local`:**

```env
# API Backend
# IMPORTANTE: Já inclui /api/v1 no final
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Application
NEXT_PUBLIC_APP_NAME="Projeto Cirurgião"
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

> **⚠️ ATENÇÃO:** O `NEXT_PUBLIC_API_URL` deve incluir `/api/v1` no final. Não remova essa parte, pois o cliente API não adiciona automaticamente.

### 4. Iniciar o Frontend

```bash
npm run dev
```

**Você deve ver:**
```
  ▲ Next.js 16.0.1
  - Local:        http://localhost:3001
  - Network:      http://192.168.1.x:3001

 ✓ Ready in 2.5s
```

---

## 🚀 Iniciando o Projeto

### Opção 1: Iniciar Manualmente (Recomendado para Desenvolvimento)

**Terminal 1 - Docker:**
```bash
docker-compose up -d
```

**Terminal 2 - Backend:**
```bash
cd backend-api
npm run start:dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend-web
npm run dev
```

### Opção 2: Usar Scripts Automatizados (Windows)

```bash
# Iniciar tudo
.\scripts\start-dev.bat

# Parar tudo
.\scripts\stop-dev.bat

# Resetar banco de dados
.\scripts\reset-db.bat
```

---

## 🧪 Testando a Aplicação

### 1. Acessar o Frontend

Abra o navegador em: **http://localhost:3001**

### 2. Criar uma Conta

1. Clique em **"Criar conta"** ou acesse: http://localhost:3001/register
2. Preencha os dados:
   - Nome: `Teste Usuario`
   - Email: `teste@exemplo.com`
   - Senha: `Senha123!`
   - Confirmar Senha: `Senha123!`
3. Clique em **"Cadastrar"**

### 3. Fazer Login

1. Acesse: http://localhost:3001/login
2. Use as credenciais criadas:
   - Email: `teste@exemplo.com`
   - Senha: `Senha123!`
3. Clique em **"Entrar"**

### 4. Acessar o Dashboard

Após o login, você será redirecionado para: **http://localhost:3001/dashboard**

### 5. Testar API Diretamente

**Registrar usuário via API:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API User",
    "email": "api@exemplo.com",
    "password": "Senha123!"
  }'
```

**Login via API:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@exemplo.com",
    "password": "Senha123!"
  }'
```

**Resposta esperada:**
```json
{
  "user": {
    "id": "uuid-aqui",
    "email": "api@exemplo.com",
    "name": "API User",
    "role": "STUDENT"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔍 Troubleshooting

### Problema: Docker não inicia

**Erro:** `Cannot connect to the Docker daemon`

**Solução:**
1. Certifique-se de que o Docker Desktop está rodando
2. No Windows, verifique se o WSL2 está instalado
3. Reinicie o Docker Desktop

### Problema: Porta já em uso

**Erro:** `Port 3000 is already in use`

**Solução:**
```bash
# Windows - Encontrar processo na porta 3000
netstat -ano | findstr :3000

# Matar processo (substitua PID)
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Problema: Erro de conexão com PostgreSQL

**Erro:** `Can't reach database server at localhost:5432`

**Solução:**
```bash
# Verificar se o container está rodando
docker-compose ps

# Reiniciar PostgreSQL
docker-compose restart postgres

# Ver logs
docker-compose logs postgres
```

### Problema: Prisma não encontra o banco

**Erro:** `Error: P1001: Can't reach database server`

**Solução:**
1. Verifique se o PostgreSQL está rodando: `docker-compose ps`
2. Verifique a `DATABASE_URL` no `.env`
3. Tente regenerar o Prisma Client:
```bash
cd backend-api
npm run prisma:generate
npm run prisma:migrate
```

### Problema: Frontend não conecta com Backend

**Erro:** `Network Error` ou `CORS Error`

**Solução:**
1. Verifique se o backend está rodando em `http://localhost:3000`
2. Verifique o `NEXT_PUBLIC_API_URL` no `.env.local`
3. Verifique o `CORS_ORIGINS` no backend `.env`
4. Limpe o cache do Next.js:
```bash
cd frontend-web
rm -rf .next
npm run dev
```

### Problema: Módulos não encontrados

**Erro:** `Cannot find module 'xyz'`

**Solução:**
```bash
# Deletar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Ou usar npm ci (mais rápido)
npm ci
```

---

## 📝 Comandos Úteis

### Docker

```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f postgres

# Reiniciar um serviço
docker-compose restart postgres

# Remover volumes (CUIDADO: apaga dados)
docker-compose down -v
```

### Backend

```bash
cd backend-api

# Desenvolvimento
npm run start:dev

# Build para produção
npm run build

# Iniciar produção
npm run start:prod

# Testes
npm run test
npm run test:watch
npm run test:cov

# Prisma
npm run prisma:generate    # Gerar client
npm run prisma:migrate     # Criar/aplicar migrations
npm run prisma:studio      # Interface visual
npm run prisma:seed        # Popular banco (quando implementado)

# Lint e Format
npm run lint
npm run format
```

### Frontend

```bash
cd frontend-web

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm run start

# Lint
npm run lint
```

### Git

```bash
# Ver status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: descrição da mudança"

# Push
git push origin main

# Pull
git pull origin main

# Ver branches
git branch

# Criar nova branch
git checkout -b feature/nova-funcionalidade
```

---

## 🎯 Próximos Passos

Agora que o projeto está rodando, você pode:

1. **Explorar o código:**
   - Backend: `backend-api/src/`
   - Frontend: `frontend-web/src/`

2. **Ler a documentação:**
   - `ROADMAP_WEB_EXCLUSIVO.md` - Roadmap completo
   - `docs/` - Documentação técnica

3. **Começar o desenvolvimento das Semanas 3-4:**
   - Integração Cloudflare Stream/R2
   - Dashboard administrativo
   - Sistema de cursos e vídeos

4. **Configurar ferramentas adicionais:**
   - Cloudflare (quando necessário)
   - GCP (quando necessário)
   - OpenAI (Semanas 7+)
   - Stripe (Semanas 13+)

---

## 📚 Recursos Adicionais

### Documentação Oficial

- **NestJS**: https://docs.nestjs.com/
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/

### Ferramentas de Desenvolvimento

- **Postman**: Para testar APIs - https://www.postman.com/
- **Insomnia**: Alternativa ao Postman - https://insomnia.rest/
- **TablePlus**: Cliente de banco de dados - https://tableplus.com/
- **Prisma Studio**: Interface visual do Prisma (incluído)

### Extensões VSCode Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "ms-azuretools.vscode-docker",
    "rangav.vscode-thunder-client"
  ]
}
```

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique a seção [Troubleshooting](#troubleshooting)
2. Consulte os logs: `docker-compose logs -f`
3. Verifique as issues no GitHub
4. Entre em contato com a equipe de desenvolvimento

---

## ✅ Checklist de Inicialização

Use este checklist para garantir que tudo está configurado:

- [ ] Node.js instalado (v20+)
- [ ] Docker Desktop instalado e rodando
- [ ] Repositório clonado
- [ ] Docker Compose iniciado (`docker-compose up -d`)
- [ ] PostgreSQL acessível (porta 5432)
- [ ] Redis acessível (porta 6379)
- [ ] Backend: dependências instaladas (`npm install`)
- [ ] Backend: arquivo `.env` configurado
- [ ] Backend: Prisma configurado (`npm run prisma:migrate`)
- [ ] Backend: servidor rodando (`npm run start:dev`)
- [ ] Backend: API respondendo em `http://localhost:3000`
- [ ] Frontend: dependências instaladas (`npm install`)
- [ ] Frontend: arquivo `.env.local` configurado
- [ ] Frontend: servidor rodando (`npm run dev`)
- [ ] Frontend: aplicação acessível em `http://localhost:3001`
- [ ] Teste: Registro de usuário funcionando
- [ ] Teste: Login funcionando
- [ ] Teste: Dashboard acessível

---

**🎉 Parabéns! Seu ambiente de desenvolvimento está pronto!**

Agora você pode começar a desenvolver as próximas funcionalidades do projeto seguindo o **ROADMAP_WEB_EXCLUSIVO.md**.

---

*Última atualização: 19/11/2025*
*Versão: 1.0.0*
