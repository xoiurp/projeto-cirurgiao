# 🔐 Guia Completo de Teste de Autenticação

## Projeto Cirurgião - Frontend + Backend

Este guia mostra como iniciar e testar a autenticação completa do sistema.

---

## 📋 Pré-requisitos

- ✅ Docker Desktop instalado e rodando
- ✅ Node.js 18+ instalado
- ✅ PostgreSQL rodando via Docker

---

## 🚀 Passo 1: Iniciar o Banco de Dados

### Opção A: Usando Docker Compose (Recomendado)

```bash
# No diretório raiz do projeto
docker-compose up -d
```

Isso iniciará:
- PostgreSQL na porta 5432
- Adminer (interface web) na porta 8080

### Opção B: Usando script Windows

```bash
.\scripts\start-dev.bat
```

### Verificar se o banco está rodando

Acesse: http://localhost:8080 (Adminer)
- **Sistema**: PostgreSQL
- **Servidor**: postgres
- **Usuário**: cirurgiao_user
- **Senha**: cirurgiao_pass_2024
- **Base de dados**: projeto_cirurgiao

---

## 🔧 Passo 2: Configurar e Iniciar o Backend

### 2.1. Navegar para o diretório do backend

```bash
cd backend-api
```

### 2.2. Instalar dependências (se ainda não instalou)

```bash
npm install
```

### 2.3. Verificar arquivo .env

O arquivo `backend-api/.env` deve conter:

```env
# Database
DATABASE_URL="postgresql://cirurgiao_user:cirurgiao_pass_2024@localhost:5432/projeto_cirurgiao?schema=public"

# JWT
JWT_SECRET="seu-secret-super-seguro-aqui-mude-em-producao"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="seu-refresh-secret-super-seguro-aqui"
REFRESH_TOKEN_EXPIRES_IN="7d"

# App
PORT=3000
NODE_ENV=development
```

### 2.4. Executar migrations do Prisma

```bash
npx prisma migrate dev
```

Isso criará as tabelas no banco de dados.

### 2.5. Gerar o Prisma Client

```bash
npx prisma generate
```

### 2.6. Iniciar o servidor backend

```bash
npm run start:dev
```

✅ **Backend rodando em**: http://localhost:3000

✅ **Documentação Swagger**: http://localhost:3000/api/docs

---

## 🎨 Passo 3: Configurar e Iniciar o Frontend

### 3.1. Abrir um NOVO terminal (deixe o backend rodando)

### 3.2. Navegar para o diretório do frontend

```bash
cd frontend-web
```

### 3.3. Instalar dependências (se ainda não instalou)

```bash
npm install
```

### 3.4. Verificar arquivo .env.local

O arquivo `frontend-web/.env.local` deve conter:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3.5. Iniciar o servidor frontend

```bash
npm run dev
```

✅ **Frontend rodando em**: http://localhost:3001

---

## 🧪 Passo 4: Testar a Autenticação

### 4.1. Criar uma conta

1. Acesse: http://localhost:3001/register
2. Preencha o formulário:
   - **Nome**: João Silva
   - **Email**: joao@teste.com
   - **Senha**: Teste@123
   - **Confirmar Senha**: Teste@123
3. Clique em "Criar Conta"

✅ Você será redirecionado automaticamente para o dashboard!

### 4.2. Fazer logout

1. No dashboard, clique no botão "Sair"
2. Você será redirecionado para a página de login

### 4.3. Fazer login

1. Acesse: http://localhost:3001/login
2. Use as credenciais:
   - **Email**: joao@teste.com
   - **Senha**: Teste@123
3. Clique em "Entrar"

✅ Você será redirecionado para o dashboard!

### 4.4. Testar recuperação de senha

1. Na página de login, clique em "Esqueceu sua senha?"
2. Digite seu email: joao@teste.com
3. Clique em "Enviar Instruções"

✅ Você verá uma mensagem de sucesso (em produção, um email seria enviado)

---

## 🔍 Passo 5: Verificar no Banco de Dados

### Via Adminer (Interface Web)

1. Acesse: http://localhost:8080
2. Faça login com as credenciais do banco
3. Clique em "users" para ver os usuários criados
4. Clique em "refresh_tokens" para ver os tokens

### Via Prisma Studio

```bash
cd backend-api
npx prisma studio
```

Isso abrirá uma interface web em http://localhost:5555

---

## 🐛 Troubleshooting

### Problema: "Cannot connect to database"

**Solução**:
```bash
# Verificar se o Docker está rodando
docker ps

# Se não estiver, iniciar o banco
docker-compose up -d

# Aguardar 10 segundos e tentar novamente
```

### Problema: "Port 3000 already in use"

**Solução**:
```bash
# Encontrar o processo usando a porta
netstat -ano | findstr :3000

# Matar o processo (substitua PID pelo número encontrado)
taskkill /PID <PID> /F

# Ou usar outra porta no backend
