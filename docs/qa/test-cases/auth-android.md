# 🧪 Test Cases - Autenticação Android

## Informações do Teste
- **Módulo**: App Android - Autenticação
- **Responsável**: QA-01 (Carlos)
- **Data**: 09/11/2025
- **Versão**: 1.0

---

## TC-AND-001: Inicialização do App

### Objetivo
Verificar se o app inicia corretamente

### Pré-condições
- App instalado no emulador/dispositivo
- Backend rodando

### Passos
1. Abrir o app

### Resultado Esperado
- App abre sem crashes
- Tela de login é exibida
- Elementos da UI carregam corretamente
- Splash screen (se houver) funciona

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-AND-002: Login com Credenciais Válidas

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
- Token salvo no SharedPreferences/DataStore
- Dados do usuário carregados

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-AND-003: Login com Credenciais Inválidas

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
- Snackbar/Toast com mensagem de erro
- Usuário permanece na tela de login
- Campos não são limpos

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-AND-004: Validação de Campos Vazios

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

## TC-AND-005: Registro com Dados Válidos

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
- Token salvo
- Usuário autenticado

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-AND-006: Registro com Email Duplicado

### Objetivo
Verificar tratamento de erro de email já cadastrado

### Pré-condições
- App aberto
- Backend rodando
- Email já cadastrado

### Passos
1. Tentar registrar com email existente

### Resultado Esperado
- Snackbar/Dialog com mensagem de erro
- "Email já cadastrado"
- Usuário permanece na tela de registro

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-AND-007: Validação de Senhas Diferentes

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

## TC-AND-008: Forgot Password

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
- Snackbar de sucesso
- Mensagem para verificar email
- Botão para voltar ao login

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-AND-009: Persistência de Sessão

### Objetivo
Verificar se sessão persiste após fechar o app

### Pré-condições
- Usuário logado

### Passos
1. Fazer login
2. Fechar o app completamente (remover da lista de apps recentes)
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

## TC-AND-010: Logout

### Objetivo
Verificar funcionalidade de logout

### Pré-condições
- Usuário logado

### Passos
1. No Dashboard, tocar em "Sair"
2. Confirmar logout

### Resultado Esperado
- Token removido do storage
- Navegação para tela de login
- Não é possível voltar ao Dashboard com back button

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-AND-011: Tratamento de Erro de Rede

### Objetivo
Verificar comportamento quando backend está offline

### Pré-condições
- App aberto
- Backend offline

### Passos
1. Tentar fazer login

### Resultado Esperado
- Snackbar/Dialog com erro de conexão
- Mensagem clara sobre problema de rede
- Opção de tentar novamente

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-AND-012: Teclado - Navegação entre Campos

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
- Tipo de teclado apropriado para cada campo (email keyboard, password)

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-AND-013: Teclado - Dismiss ao Tocar Fora

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

## TC-AND-014: Orientação - Portrait/Landscape

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
- ViewModel mantém estado

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-AND-015: Dark Mode

### Objetivo
Verificar suporte a Dark Mode

### Pré-condições
- App aberto
- Android com Dark Mode habilitado

### Passos
1. Ativar Dark Mode no sistema
2. Verificar telas do app

### Resultado Esperado
- Cores se adaptam ao Dark Mode
- Texto permanece legível
- Contraste adequado
- Material Design 3 themes aplicados

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-AND-016: Acessibilidade - TalkBack

### Objetivo
Verificar compatibilidade com TalkBack

### Pré-condições
- App aberto
- TalkBack ativado

### Passos
1. Navegar pela tela de login com TalkBack

### Resultado Esperado
- Todos os elementos são anunciados
- Content descriptions são descritivos
- Navegação é lógica

### Prioridade
🟢 Baixa

### Status
⏳ Pendente

---

## TC-AND-017: Acessibilidade - Tamanho de Fonte

### Objetivo
Verificar suporte a tamanhos de fonte do sistema

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
- Composables se adaptam

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-AND-018: Performance - Tempo de Resposta

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
- Transições são suaves (60fps)
- Sem lag perceptível
- Compose recompositions otimizadas

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-AND-019: Memory Leaks

### Objetivo
Verificar se há vazamentos de memória

### Pré-condições
- App aberto
- Android Profiler rodando

### Passos
1. Navegar entre telas múltiplas vezes
2. Fazer login/logout repetidamente
3. Monitorar uso de memória

### Resultado Esperado
- Memória não cresce indefinidamente
- ViewModels são limpos corretamente
- Sem warnings de memória
- Garbage collector funciona normalmente

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-AND-020: Compatibilidade de Versões

### Objetivo
Verificar compatibilidade com diferentes versões do Android

### Pré-condições
- App compilado
- Emuladores de diferentes versões

### Passos
1. Testar em Android 8 (API 26)
2. Testar em Android 10 (API 29)
3. Testar em Android 13 (API 33)
4. Testar em Android 14 (API 34)

### Resultado Esperado
- App funciona em todas as versões suportadas
- Sem crashes
- Funcionalidades principais operacionais
- Material Design se adapta

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-AND-021: Back Button Behavior

### Objetivo
Verificar comportamento do botão voltar

### Pré-condições
- App aberto

### Passos
1. Navegar para tela de registro
2. Pressionar botão voltar
3. Fazer login e ir para dashboard
4. Pressionar botão voltar

### Resultado Esperado
- Volta para tela anterior apropriada
- Dashboard não volta para login
- Confirmação de saída quando apropriado

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-AND-022: Process Death

### Objetivo
Verificar recuperação após process death

### Pré-condições
- App aberto
- Usuário logado

### Passos
1. Fazer login
2. Simular process death (Don't keep activities)
3. Voltar ao app

### Resultado Esperado
- Estado é restaurado corretamente
- Usuário permanece autenticado
- Dados não são perdidos

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## TC-AND-023: Notificações Push

### Objetivo
Verificar se notificações push funcionam (se implementado)

### Pré-condições
- App instalado
- Firebase configurado

### Passos
1. Fazer login
2. Enviar notificação de teste

### Resultado Esperado
- Notificação é recebida
- Ao tocar, abre o app corretamente
- Ícone e texto corretos

### Prioridade
🟢 Baixa

### Status
⏳ Pendente

---

## TC-AND-024: Diferentes Tamanhos de Tela

### Objetivo
Verificar responsividade em diferentes tamanhos

### Pré-condições
- App compilado

### Passos
1. Testar em telefone pequeno (< 5")
2. Testar em telefone grande (> 6")
3. Testar em tablet

### Resultado Esperado
- Layout se adapta corretamente
- Elementos são clicáveis
- Texto é legível
- Compose layouts responsivos

### Prioridade
🟡 Média

### Status
⏳ Pendente

---

## TC-AND-025: Proguard/R8

### Objetivo
Verificar se build de release funciona com ofuscação

### Pré-condições
- Build de release gerado

### Passos
1. Instalar APK de release
2. Testar funcionalidades principais

### Resultado Esperado
- App funciona normalmente
- Sem crashes por ofuscação
- Logs não expõem informações sensíveis

### Prioridade
🔴 Alta

### Status
⏳ Pendente

---

## Resumo dos Testes

### Por Prioridade
- 🔴 Alta: 10 casos
- 🟡 Média: 12 casos
- 🟢 Baixa: 3 casos

### Por Status
- ⏳ Pendente: 25 casos
- ✅ Passou: 0 casos
- ❌ Falhou: 0 casos
- ⚠️ Bloqueado: 0 casos

### Observações
- Testes Android podem ser executados em emulador
- Priorizar testes de funcionalidade core
- Verificar compatibilidade com diferentes fabricantes se possível

---

**Última Atualização**: 09/11/2025  
**Próxima Revisão**: Após execução dos testes
