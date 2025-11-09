# ⚡ Teste Rápido de Autenticação

## Guia Simplificado para Testar o Sistema

---

## 🚀 Início Rápido (3 Passos)

### 1️⃣ Iniciar o Banco de Dados

```bash
docker-compose up -d
```

Aguarde 10 segundos para o banco inicializar.

---

### 2️⃣ Iniciar o Backend

**Terminal 1:**

```bash
cd backend-api
npm run start:dev
```

✅ Aguarde ver: `🚀 Aplicação rodando em: http://localhost:3000`

---

### 3️⃣ Iniciar o Frontend

**Terminal 2 (NOVO):**

```bash
cd frontend-web
npm run dev
```

✅ Aguarde ver: `▲ Next.js ... ready on http://localhost:3001`

---

## 🧪 Testar Agora!

### Opção 1: Criar Nova Conta

1. Abra: **http://localhost:3001/register**
2. Preencha:
   - Nome: `Seu Nome`
   - Email: `seu@email.com`
   - Senha: `Teste@123`
   - Confirmar: `Teste@123`
3. Clique em **"Criar Conta"**

✅ **Sucesso!** Você será redirecionado para o dashboard!

---

### Opção 2: Testar Login

1. Abra: **http://localhost:3001/login**
2. Use as credenciais que você criou
3. Clique em **"Entrar"**

✅ **Sucesso!** Você verá o dashboard com seus dados!

---

## 🔍 Verificar no Banco

### Via Adminer (Interface Web)

1. Abra: **http://localhost:8080**
2. Login:
   - Sistema: `PostgreSQL`
   - Servidor: `postgres`
   - Usuário: `cirurgiao_user`
   - Senha: `cirurgiao_pass_2024`
   - Base: `projeto_cirurgiao`
3. Clique em **"users"** para ver os usuários

---

### Via Prisma Studio

```bash
cd backend-api
npx prisma studio
```

Abre em: **http://localhost:5555**

---

## 📊 URLs Importantes

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:3001 | Interface do usuário |
| **Backend API** | http://localhost:3000/api/v1 | API REST |
| **Swagger Docs** | http://localhost:3000/api/docs | Documentação da API |
| **Adminer** | http://localhost:8080 | Interface do banco |
| **Prisma Studio** | http://localhost:5555 | Editor do banco |

---

## ❌ Problemas Comuns

### "Cannot connect to database"

```bash
docker-compose restart
```

Aguarde 10 segundos e tente novamente.

---

### "Port already in use"

**Backend (porta 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <número> /F
```

**Frontend (porta 3001):**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <número> /F
```

---

### "Module not found" no Frontend

```bash
cd frontend-web
rm -rf .next node_modules
npm install
npm run dev
```

---

### Erro 404 na API

✅ **CORRIGIDO!** O frontend agora usa o prefixo correto `/api/v1`

Se ainda tiver problemas, verifique:
- Backend está rodando?
- URL correta: `http://localhost:3000/api/v1/auth/login`

---

## 🎯 Fluxo de Teste Completo

```
1. ✅ Banco rodando (docker-compose up -d)
2. ✅ Backend rodando (Terminal 1)
3. ✅ Frontend rodando (Terminal 2)
4. ✅ Abrir http://localhost:3001/register
5. ✅ Criar conta
6. ✅ Ver dashboard
7. ✅ Fazer logout
8. ✅ Fazer login novamente
9. ✅ Verificar usuário no banco (Adminer)
```

---

## 🔐 Credenciais de Teste

Você pode criar quantas contas quiser!

**Exemplos:**
- Email: `admin@teste.com` | Senha: `Admin@123`
- Email: `aluno@teste.com` | Senha: `Aluno@123`
- Email: `prof@teste.com` | Senha: `Professor@123`

**Requisitos da senha:**
- Mínimo 8 caracteres
- 1 letra maiúscula
- 1 letra minúscula
- 1 número

---

## 📝 Checklist Rápido

- [ ] Docker Desktop aberto
- [ ] `docker-compose up -d` executado
- [ ] Backend rodando (Terminal 1)
- [ ] Frontend rodando (Terminal 2)
- [ ] Consegue acessar http://localhost:3001
- [ ] Consegue criar conta
- [ ] Consegue fazer login
- [ ] Vê o dashboard

---

## 🆘 Ainda com Problemas?

1. **Verifique os logs** nos terminais
2. **Abra o console** do navegador (F12)
3. **Teste a API** diretamente: http://localhost:3000/api/docs
4. **Consulte** o guia completo: `GUIA_TESTE_AUTENTICACAO.md`

---

## ✅ Tudo Funcionando?

Parabéns! 🎉

Agora você pode:
- Desenvolver novas funcionalidades
- Adicionar mais páginas
- Implementar módulos de cursos
- Integrar com outros serviços

---

**Última atualização**: 09/11/2025
