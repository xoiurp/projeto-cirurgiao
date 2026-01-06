# 🧪 Test Cases - Autenticação Backend

## Informações do Teste
- **Módulo**: Backend API - Autenticação
- **Responsável**: QA-01 (Carlos)
- **Data**: 09/11/2025
- **Versão**: 1.0

---

## TC-BE-001: Login com Credenciais Válidas

### Objetivo
Verificar se o usuário consegue fazer login com credenciais válidas

### Pré-condições
- Backend rodando em http://localhost:3000
- Usuário cadastrado no banco de dados
- Email: test@example.com
- Senha: Test@123

### Passos
1. Enviar POST para `/api/auth/login`
2. Body:
```json
{
  "email": "test@example.com",
  "password": "Test@123"
}
```

### Resultado Esperado
- Status: 200 OK
- Response contém:
  - `accessToken` (string)
  - `refreshToken` (string)
  - `user` (objeto com id, email, name, role)

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-BE-002: Login com Email Inválido

### Objetivo
Verificar se o sistema rejeita login com email não cadastrado

### Pré-condições
- Backend rodando

### Passos
1. Enviar POST para `/api/auth/login`
2. Body:
```json
{
  "email": "naoexiste@example.com",
  "password": "Test@123"
}
```

### Resultado Esperado
- Status: 401 Unauthorized
- Response contém mensagem de erro

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-BE-003: Login com Senha Incorreta

### Objetivo
Verificar se o sistema rejeita login com senha incorreta

### Pré-condições
- Backend rodando
- Usuário cadastrado

### Passos
1. Enviar POST para `/api/auth/login`
2. Body:
```json
{
  "email": "test@example.com",
  "password": "SenhaErrada123"
}
```

### Resultado Esperado
- Status: 401 Unauthorized
- Response contém mensagem de erro

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-BE-004: Login com Email Vazio

### Objetivo
Verificar validação de campo obrigatório

### Pré-condições
- Backend rodando

### Passos
1. Enviar POST para `/api/auth/login`
2. Body:
```json
{
  "email": "",
  "password": "Test@123"
}
```

### Resultado Esperado
- Status: 400 Bad Request
- Response contém erro de validação

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-BE-005: Login com Senha Vazia

### Objetivo
Verificar validação de campo obrigatório

### Pré-condições
- Backend rodando

### Passos
1. Enviar POST para `/api/auth/login`
2. Body:
```json
{
  "email": "test@example.com",
  "password": ""
}
```

### Resultado Esperado
- Status: 400 Bad Request
- Response contém erro de validação

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-BE-006: Registro com Dados Válidos

### Objetivo
Verificar se novo usuário consegue se registrar

### Pré-condições
- Backend rodando
- Email não cadastrado

### Passos
1. Enviar POST para `/api/auth/register`
2. Body:
```json
{
  "email": "novousuario@example.com",
  "password": "Senha@123",
  "name": "Novo Usuário",
  "role": "STUDENT"
}
```

### Resultado Esperado
- Status: 201 Created
- Response contém:
  - `accessToken`
  - `refreshToken`
  - `user` (com dados do novo usuário)

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-BE-007: Registro com Email Duplicado

### Objetivo
Verificar se o sistema impede registro com email já existente

### Pré-condições
- Backend rodando
- Email já cadastrado

### Passos
1. Enviar POST para `/api/auth/register`
2. Body:
```json
{
  "email": "test@example.com",
  "password": "Senha@123",
  "name": "Teste",
  "role": "STUDENT"
}
```

### Resultado Esperado
- Status: 409 Conflict
- Response contém mensagem de erro sobre email duplicado

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-BE-008: Registro com Email Inválido

### Objetivo
Verificar validação de formato de email

### Pré-condições
- Backend rodando

### Passos
1. Enviar POST para `/api/auth/register`
2. Body:
```json
{
  "email": "emailinvalido",
  "password": "Senha@123",
  "name": "Teste",
  "role": "STUDENT"
}
```

### Resultado Esperado
- Status: 400 Bad Request
- Response contém erro de validação de email

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-BE-009: Registro com Senha Fraca

### Objetivo
Verificar validação de força da senha

### Pré-condições
- Backend rodando

### Passos
1. Enviar POST para `/api/auth/register`
2. Body:
```json
{
  "email": "teste@example.com",
  "password": "123",
  "name": "Teste",
  "role": "STUDENT"
}
```

### Resultado Esperado
- Status: 400 Bad Request
- Response contém erro sobre senha fraca

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-BE-010: Refresh Token Válido

### Objetivo
Verificar se refresh token gera novo access token

### Pré-condições
- Backend rodando
- Usuário logado com refresh token válido

### Passos
1. Fazer login e obter refresh token
2. Enviar POST para `/api/auth/refresh`
3. Body:
```json
{
  "refreshToken": "<token_obtido>"
}
```

### Resultado Esperado
- Status: 200 OK
- Response contém novo `accessToken`

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-BE-011: Refresh Token Inválido

### Objetivo
Verificar se sistema rejeita refresh token inválido

### Pré-condições
- Backend rodando

### Passos
1. Enviar POST para `/api/auth/refresh`
2. Body:
```json
{
  "refreshToken": "token_invalido_123"
}
```

### Resultado Esperado
- Status: 401 Unauthorized
- Response contém erro sobre token inválido

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-BE-012: Acesso a Rota Protegida com Token Válido

### Objetivo
Verificar se token JWT permite acesso a rotas protegidas

### Pré-condições
- Backend rodando
- Usuário logado com access token válido

### Passos
1. Fazer login e obter access token
2. Enviar GET para `/api/users/me`
3. Header: `Authorization: Bearer <access_token>`

### Resultado Esperado
- Status: 200 OK
- Response contém dados do usuário autenticado

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-BE-013: Acesso a Rota Protegida sem Token

### Objetivo
Verificar se sistema bloqueia acesso sem autenticação

### Pré-condições
- Backend rodando

### Passos
1. Enviar GET para `/api/users/me`
2. Sem header de Authorization

### Resultado Esperado
- Status: 401 Unauthorized
- Response contém erro sobre falta de autenticação

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-BE-014: Acesso a Rota Protegida com Token Expirado

### Objetivo
Verificar se sistema rejeita tokens expirados

### Pré-condições
- Backend rodando
- Token expirado disponível

### Passos
1. Enviar GET para `/api/users/me`
2. Header: `Authorization: Bearer <token_expirado>`

### Resultado Esperado
- Status: 401 Unauthorized
- Response contém erro sobre token expirado

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-BE-015: Forgot Password com Email Válido

### Objetivo
Verificar se sistema envia email de recuperação

### Pré-condições
- Backend rodando
- Email cadastrado

### Passos
1. Enviar POST para `/api/auth/forgot-password`
2. Body:
```json
{
  "email": "test@example.com"
}
```

### Resultado Esperado
- Status: 200 OK
- Response confirma envio de email
- Email de recuperação enviado (verificar logs)

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## Resumo dos Testes

### Por Prioridade
- 🔴 Alta: 11 casos
- 🟡 Média: 4 casos
- 🟢 Baixa: 0 casos

### Por Status
- ⏳ Pendente: 15 casos
- ✅ Passou: 0 casos
- ❌ Falhou: 0 casos
- ⚠️ Bloqueado: 0 casos

---

**Última Atualização**: 09/11/2025  
**Próxima Revisão**: Após execução dos testes
