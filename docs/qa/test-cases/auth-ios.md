# 🧪 Test Cases - Autenticação iOS

## Informações do Teste
- **Módulo**: App iOS - Autenticação
- **Responsável**: QA-01 (Carlos)
- **Data**: 09/11/2025
- **Versão**: 1.0

---

## TC-iOS-001: Inicialização do App

### Objetivo
Verificar se o app inicia corretamente

### Pré-condições
- App instalado no simulador/dispositivo
- Backend rodando

### Passos
1. Abrir o app

### Resultado Esperado
- App abre sem crashes
- Tela de login é exibida
- Elementos da UI carregam corretamente

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-iOS-002: Login com Credenciais Válidas

### Objetivo
Verificar fluxo de login bem-sucedido

### Pré-condições
- App aberto
- Backend rodando
- Usuário cadastrado

### Passos
1. Preencher email: test@example.com
2. Preencher senha: Test@123
3. Tocar em "Entrar"

### Resultado Esperado
- Loading indicator aparece
- Navegação para tela Dashboard
- Token salvo no Keychain
- Dados do usuário carregados

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-iOS-003: Login com Credenciais Inválidas

### Objetivo
Verificar tratamento de erro de autenticação

### Pré-condições
- App aberto
- Backend rodando

### Passos
1. Preencher email: test@example.com
2. Preencher senha: SenhaErrada
3. Tocar em "Entrar"

### Resultado Esperado
- Alert com mensagem de erro
- Usuário permanece na tela de login
- Campos não são limpos

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-iOS-004: Validação de Campos Vazios

### Objetivo
Verificar validação de campos obrigatórios

### Pré-condições
- App aberto

### Passos
1. Deixar campos vazios
2. Tocar em "Entrar"

### Resultado Esperado
- Mensagem de erro exibida
- Campos ficam destacados em vermelho
- Formulário não é submetido

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-iOS-005: Registro com Dados Válidos

### Objetivo
Verificar fluxo de registro bem-sucedido

### Pré-condições
- App aberto
- Backend rodando

### Passos
1. Tocar em "Criar conta"
2. Preencher nome: Novo Usuário
3. Preencher email: novo@example.com
4. Preencher senha: Senha@123
5. Confirmar senha: Senha@123
6. Tocar em "Registrar"

### Resultado Esperado
- Loading indicator aparece
- Navegação para Dashboard
- Token salvo no Keychain
- Usuário autenticado

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-iOS-006: Registro com Email Duplicado

### Objetivo
Verificar tratamento de erro de email já cadastrado

### Pré-condições
- App aberto
- Backend rodando
- Email já cadastrado

### Passos
1. Tentar registrar com email existente

### Resultado Esperado
- Alert com mensagem de erro
- "Email já cadastrado"
- Usuário permanece na tela de registro

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-iOS-007: Validação de Senhas Diferentes

### Objetivo
Verificar validação de confirmação de senha

### Pré-condições
- App aberto

### Passos
1. Na tela de registro
2. Preencher senha: Senha@123
3. Confirmar senha: Senha@456
4. Tocar em "Registrar"

### Resultado Esperado
- Mensagem de erro exibida
- "As senhas não coincidem"
- Formulário não é submetido

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-iOS-008: Forgot Password

### Objetivo
Verificar fluxo de recuperação de senha

### Pré-condições
- App aberto
- Backend rodando

### Passos
1. Tocar em "Esqueci minha senha"
2. Preencher email: test@example.com
3. Tocar em "Enviar"

### Resultado Esperado
- Alert de sucesso
- Mensagem para verificar email
- Botão para voltar ao login

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-iOS-009: Persistência de Sessão

### Objetivo
Verificar se sessão persiste após fechar o app

### Pré-condições
- Usuário logado

### Passos
1. Fazer login
2. Fechar o app completamente
3. Abrir o app novamente

### Resultado Esperado
- Usuário permanece autenticado
- Dashboard é exibido diretamente
- Não há necessidade de novo login

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-iOS-010: Logout

### Objetivo
Verificar funcionalidade de logout

### Pré-condições
- Usuário logado

### Passos
1. No Dashboard, tocar em "Sair"
2. Confirmar logout

### Resultado Esperado
- Token removido do Keychain
- Navegação para tela de login
- Não é possível voltar ao Dashboard

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-iOS-011: Tratamento de Erro de Rede

### Objetivo
Verificar comportamento quando backend está offline

### Pré-condições
- App aberto
- Backend offline

### Passos
1. Tentar fazer login

### Resultado Esperado
- Alert com erro de conexão
- Mensagem clara sobre problema de rede
- Opção de tentar novamente

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-iOS-012: Teclado - Navegação entre Campos

### Objetivo
Verificar navegação entre campos com teclado

### Pré-condições
- App aberto na tela de login

### Passos
1. Tocar no campo email
2. Preencher email
3. Tocar em "Next" no teclado

### Resultado Esperado
- Foco move para campo senha
- Teclado permanece aberto
- Tipo de teclado apropriado para cada campo

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-iOS-013: Teclado - Dismiss ao Tocar Fora

### Objetivo
Verificar se teclado fecha ao tocar fora dos campos

### Pré-condições
- App aberto
- Teclado visível

### Passos
1. Tocar em qualquer campo
2. Tocar fora dos campos

### Resultado Esperado
- Teclado é fechado
- Campos mantêm valores preenchidos

### Prioridade
🟢 Baixa

### Status
⏳ Pendente

---

## TC-iOS-014: Orientação - Portrait/Landscape

### Objetivo
Verificar comportamento em diferentes orientações

### Pré-condições
- App aberto

### Passos
1. Rotacionar dispositivo para landscape
2. Rotacionar de volta para portrait

### Resultado Esperado
- Layout se adapta corretamente
- Dados não são perdidos
- Sem crashes ou bugs visuais

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-iOS-015: Dark Mode

### Objetivo
Verificar suporte a Dark Mode

### Pré-condições
- App aberto
- iOS com Dark Mode habilitado

### Passos
1. Ativar Dark Mode no sistema
2. Verificar telas do app

### Resultado Esperado
- Cores se adaptam ao Dark Mode
- Texto permanece legível
- Contraste adequado

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-iOS-016: Acessibilidade - VoiceOver

### Objetivo
Verificar compatibilidade com VoiceOver

### Pré-condições
- App aberto
- VoiceOver ativado

### Passos
1. Navegar pela tela de login com VoiceOver

### Resultado Esperado
- Todos os elementos são anunciados
- Labels são descritivos
- Navegação é lógica

### Prioridade
🟢 Baixa

### Status
⏳ Pendente

---

## TC-iOS-017: Acessibilidade - Dynamic Type

### Objetivo
Verificar suporte a tamanhos de fonte dinâmicos

### Pré-condições
- App aberto
- Tamanho de fonte aumentado no sistema

### Passos
1. Aumentar tamanho de fonte nas configurações
2. Verificar telas do app

### Resultado Esperado
- Texto escala corretamente
- Layout não quebra
- Conteúdo permanece legível

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-iOS-018: Performance - Tempo de Resposta

### Objetivo
Verificar performance do app

### Pré-condições
- App aberto
- Backend rodando

### Passos
1. Fazer login
2. Medir tempo de resposta

### Resultado Esperado
- Login completa em < 2 segundos
- Transições são suaves
- Sem lag perceptível

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-iOS-019: Memory Leaks

### Objetivo
Verificar se há vazamentos de memória

### Pré-condições
- App aberto
- Instruments rodando

### Passos
1. Navegar entre telas múltiplas vezes
2. Fazer login/logout repetidamente
3. Monitorar uso de memória

### Resultado Esperado
- Memória não cresce indefinidamente
- Objetos são desalocados corretamente
- Sem warnings de memória

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-iOS-020: Compatibilidade de Versões

### Objetivo
Verificar compatibilidade com diferentes versões do iOS

### Pré-condições
- App compilado
- Simuladores de diferentes versões

### Passos
1. Testar em iOS 15
2. Testar em iOS 16
3. Testar em iOS 17

### Resultado Esperado
- App funciona em todas as versões suportadas
- Sem crashes
- Funcionalidades principais operacionais

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## Resumo dos Testes

### Por Prioridade
- 🔴 Alta: 9 casos
- 🟡 Média: 9 casos
- 🟢 Baixa: 2 casos

### Por Status
- ⏳ Pendente: 20 casos
- ✅ Passou: 0 casos
- ❌ Falhou: 0 casos
- ⚠️ Bloqueado: 0 casos

### Observações
- Testes iOS requerem MacOS ou MacInCloud
- Alguns testes podem ser bloqueados por falta de ambiente
- Priorizar testes de funcionalidade core

---

**Última Atualização**: 09/11/2025  
**Próxima Revisão**: Após execução dos testes
