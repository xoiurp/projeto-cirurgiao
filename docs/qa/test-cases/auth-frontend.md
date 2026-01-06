# 🧪 Test Cases - Autenticação Frontend Web

## Informações do Teste
- **Módulo**: Frontend Web - Autenticação
- **Responsável**: QA-01 (Carlos)
- **Data**: 09/11/2025
- **Versão**: 1.0

---

## TC-FE-001: Renderização da Página de Login

### Objetivo
Verificar se a página de login é renderizada corretamente

### Pré-condições
- Frontend rodando em http://localhost:3001

### Passos
1. Acessar http://localhost:3001/login

### Resultado Esperado
- Página carrega sem erros
- Formulário de login visível
- Campos: Email e Senha
- Botão "Entrar"
- Link "Esqueci minha senha"
- Link "Criar conta"

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-FE-002: Login com Credenciais Válidas

### Objetivo
Verificar fluxo completo de login bem-sucedido

### Pré-condições
- Frontend rodando
- Backend rodando
- Usuário cadastrado

### Passos
1. Acessar /login
2. Preencher email: test@example.com
3. Preencher senha: Test@123
4. Clicar em "Entrar"

### Resultado Esperado
- Loading indicator aparece
- Redirecionamento para /dashboard
- Token armazenado no localStorage/cookies
- Usuário autenticado

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-FE-003: Login com Credenciais Inválidas

### Objetivo
Verificar tratamento de erro de autenticação

### Pré-condições
- Frontend rodando
- Backend rodando

### Passos
1. Acessar /login
2. Preencher email: test@example.com
3. Preencher senha: SenhaErrada
4. Clicar em "Entrar"

### Resultado Esperado
- Mensagem de erro exibida
- Usuário permanece na página de login
- Campos não são limpos
- Foco retorna ao campo de senha

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-FE-004: Validação de Email Vazio

### Objetivo
Verificar validação client-side de campo obrigatório

### Pré-condições
- Frontend rodando

### Passos
1. Acessar /login
2. Deixar email vazio
3. Preencher senha: Test@123
4. Clicar em "Entrar"

### Resultado Esperado
- Mensagem de erro no campo email
- Formulário não é submetido
- Borda do campo email fica vermelha

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-FE-005: Validação de Senha Vazia

### Objetivo
Verificar validação client-side de campo obrigatório

### Pré-condições
- Frontend rodando

### Passos
1. Acessar /login
2. Preencher email: test@example.com
3. Deixar senha vazia
4. Clicar em "Entrar"

### Resultado Esperado
- Mensagem de erro no campo senha
- Formulário não é submetido
- Borda do campo senha fica vermelha

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-FE-006: Validação de Formato de Email

### Objetivo
Verificar validação de formato de email

### Pré-condições
- Frontend rodando

### Passos
1. Acessar /login
2. Preencher email: emailinvalido
3. Preencher senha: Test@123
4. Clicar em "Entrar"

### Resultado Esperado
- Mensagem de erro "Email inválido"
- Formulário não é submetido

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-FE-007: Renderização da Página de Registro

### Objetivo
Verificar se a página de registro é renderizada corretamente

### Pré-condições
- Frontend rodando

### Passos
1. Acessar http://localhost:3001/register

### Resultado Esperado
- Página carrega sem erros
- Formulário de registro visível
- Campos: Nome, Email, Senha, Confirmar Senha
- Botão "Criar conta"
- Link "Já tenho conta"

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-FE-008: Registro com Dados Válidos

### Objetivo
Verificar fluxo completo de registro bem-sucedido

### Pré-condições
- Frontend rodando
- Backend rodando

### Passos
1. Acessar /register
2. Preencher nome: Novo Usuário
3. Preencher email: novo@example.com
4. Preencher senha: Senha@123
5. Confirmar senha: Senha@123
6. Clicar em "Criar conta"

### Resultado Esperado
- Loading indicator aparece
- Redirecionamento para /dashboard
- Token armazenado
- Usuário autenticado

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-FE-009: Registro com Email Duplicado

### Objetivo
Verificar tratamento de erro de email já cadastrado

### Pré-condições
- Frontend rodando
- Backend rodando
- Email já cadastrado

### Passos
1. Acessar /register
2. Preencher dados com email existente
3. Clicar em "Criar conta"

### Resultado Esperado
- Mensagem de erro "Email já cadastrado"
- Usuário permanece na página
- Campos não são limpos

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-FE-010: Validação de Senhas Diferentes

### Objetivo
Verificar validação de confirmação de senha

### Pré-condições
- Frontend rodando

### Passos
1. Acessar /register
2. Preencher senha: Senha@123
3. Confirmar senha: Senha@456
4. Clicar em "Criar conta"

### Resultado Esperado
- Mensagem de erro "As senhas não coincidem"
- Formulário não é submetido
- Campo de confirmação fica vermelho

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-FE-011: Renderização da Página Forgot Password

### Objetivo
Verificar se a página de recuperação é renderizada

### Pré-condições
- Frontend rodando

### Passos
1. Acessar http://localhost:3001/forgot-password

### Resultado Esperado
- Página carrega sem erros
- Campo de email visível
- Botão "Enviar link de recuperação"
- Link "Voltar para login"

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-FE-012: Forgot Password com Email Válido

### Objetivo
Verificar fluxo de recuperação de senha

### Pré-condições
- Frontend rodando
- Backend rodando

### Passos
1. Acessar /forgot-password
2. Preencher email: test@example.com
3. Clicar em "Enviar link"

### Resultado Esperado
- Mensagem de sucesso exibida
- Instrução para verificar email
- Botão para voltar ao login

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-FE-013: Proteção de Rota Dashboard

### Objetivo
Verificar se rota protegida redireciona usuário não autenticado

### Pré-condições
- Frontend rodando
- Usuário não autenticado

### Passos
1. Limpar localStorage/cookies
2. Tentar acessar /dashboard diretamente

### Resultado Esperado
- Redirecionamento automático para /login
- Mensagem "Você precisa estar autenticado"

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-FE-014: Acesso ao Dashboard Autenticado

### Objetivo
Verificar se usuário autenticado acessa dashboard

### Pré-condições
- Frontend rodando
- Usuário autenticado

### Passos
1. Fazer login
2. Verificar redirecionamento para /dashboard

### Resultado Esperado
- Dashboard carrega corretamente
- Dados do usuário exibidos
- Menu de navegação visível

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-FE-015: Logout

### Objetivo
Verificar funcionalidade de logout

### Pré-condições
- Frontend rodando
- Usuário autenticado

### Passos
1. Estar logado no dashboard
2. Clicar em botão "Sair"

### Resultado Esperado
- Token removido do storage
- Redirecionamento para /login
- Não é possível acessar /dashboard

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-FE-016: Persistência de Sessão

### Objetivo
Verificar se sessão persiste após refresh

### Pré-condições
- Frontend rodando
- Usuário autenticado

### Passos
1. Fazer login
2. Acessar /dashboard
3. Dar refresh na página (F5)

### Resultado Esperado
- Usuário permanece autenticado
- Dashboard carrega normalmente
- Não há redirecionamento para login

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-FE-017: Responsividade Mobile - Login

### Objetivo
Verificar layout responsivo em mobile

### Pré-condições
- Frontend rodando

### Passos
1. Acessar /login
2. Redimensionar para 375px (mobile)

### Resultado Esperado
- Layout se adapta corretamente
- Campos são clicáveis
- Botões têm tamanho adequado
- Texto é legível

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-FE-018: Acessibilidade - Navegação por Teclado

### Objetivo
Verificar navegação por teclado

### Pré-condições
- Frontend rodando

### Passos
1. Acessar /login
2. Usar Tab para navegar entre campos
3. Usar Enter para submeter

### Resultado Esperado
- Tab navega corretamente
- Focus visível em cada campo
- Enter submete o formulário

### Prioridade
🟢 Baixa

### Status
⏳ Pendente

---

## TC-FE-019: Loading States

### Objetivo
Verificar estados de loading durante requisições

### Pré-condições
- Frontend rodando
- Backend com delay simulado

### Passos
1. Acessar /login
2. Preencher credenciais
3. Clicar em "Entrar"
4. Observar durante requisição

### Resultado Esperado
- Botão mostra loading spinner
- Botão fica desabilitado
- Campos ficam desabilitados
- Mensagem "Entrando..." visível

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-FE-020: Tratamento de Erro de Rede

### Objetivo
Verificar tratamento quando backend está offline

### Pré-condições
- Frontend rodando
- Backend offline

### Passos
1. Parar o backend
2. Tentar fazer login

### Resultado Esperado
- Mensagem de erro de conexão
- "Não foi possível conectar ao servidor"
- Botão de tentar novamente

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## Resumo dos Testes

### Por Prioridade
- 🔴 Alta: 11 casos
- 🟡 Média: 8 casos
- 🟢 Baixa: 1 caso

### Por Status
- ⏳ Pendente: 20 casos
- ✅ Passou: 0 casos
- ❌ Falhou: 0 casos
- ⚠️ Bloqueado: 0 casos

---

**Última Atualização**: 09/11/2025  
**Próxima Revisão**: Após execução dos testes
