# 📱 Guia de Instalação do Xcode e Simulador iOS

Guia completo para instalar o Xcode, configurar simuladores iOS e executar testes no projeto CirurgiaoApp.

## 📋 Índice

1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Instalação do Xcode](#instalação-do-xcode)
3. [Configuração Inicial](#configuração-inicial)
4. [Instalando Simuladores](#instalando-simuladores)
5. [Abrindo o Projeto](#abrindo-o-projeto)
6. [Executando o App](#executando-o-app)
7. [Executando Testes](#executando-testes)
8. [Troubleshooting](#troubleshooting)

## 💻 Requisitos do Sistema

### Mínimo Necessário:
- **macOS**: 13.0 (Ventura) ou superior
- **RAM**: 8 GB (recomendado 16 GB)
- **Espaço em Disco**: ~40 GB livres
- **Processador**: Intel ou Apple Silicon (M1/M2/M3)

⚠️ **IMPORTANTE**: Xcode e simuladores iOS **APENAS funcionam em macOS**. Não é possível executar em Windows ou Linux.

## 🚀 Instalação do Xcode

### Opção 1: Via App Store (Recomendado)

1. **Abra a App Store** no seu Mac
2. **Busque por "Xcode"**
3. **Clique em "Obter"** ou "Instalar"
4. **Aguarde o download** (pode levar 30-60 minutos dependendo da conexão)
5. **Tamanho**: ~15 GB

### Opção 2: Via Site da Apple

1. Acesse: https://developer.apple.com/xcode/
2. Clique em "Download"
3. Faça login com seu Apple ID
4. Baixe o arquivo `.xip`
5. Extraia e mova para a pasta Applications

## ⚙️ Configuração Inicial

### 1. Primeira Execução

Após instalar, abra o Xcode pela primeira vez:

```bash
# Via Terminal
open -a Xcode
```

Ou procure "Xcode" no Launchpad.

### 2. Instalar Command Line Tools

Na primeira execução, o Xcode pedirá para instalar componentes adicionais:

1. Clique em **"Install"** quando solicitado
2. Digite sua senha de administrador
3. Aguarde a instalação (5-10 minutos)

Ou via terminal:

```bash
xcode-select --install
```

### 3. Aceitar Licença

```bash
sudo xcodebuild -license accept
```

### 4. Verificar Instalação

```bash
xcode-select -p
# Deve retornar: /Applications/Xcode.app/Contents/Developer

xcodebuild -version
# Deve retornar: Xcode 15.x
```

## 📱 Instalando Simuladores

### Via Xcode (Interface Gráfica)

1. **Abra o Xcode**
2. **Menu**: `Xcode` → `Settings` (ou `Preferences`)
3. **Aba**: `Platforms`
4. **Clique no botão "+"** ou "Get" ao lado de iOS
5. **Selecione a versão do iOS** (recomendado: iOS 17.x ou 16.x)
6. **Aguarde o download** (2-5 GB por versão)

### Simuladores Recomendados

Para o projeto CirurgiaoApp (iOS 16.0+):

- ✅ **iPhone 15** (iOS 17.x) - Mais recente
- ✅ **iPhone 14** (iOS 16.x) - Compatibilidade
- ✅ **iPhone SE (3rd generation)** - Tela menor
- ✅ **iPad Pro 12.9"** - Tablet

### Via Terminal (Listar Simuladores)

```bash
# Listar todos os simuladores instalados
xcrun simctl list devices

# Listar apenas dispositivos disponíveis
xcrun simctl list devices available
```

### Criar Novo Simulador

```bash
# Criar iPhone 15 com iOS 17
xcrun simctl create "iPhone 15" "iPhone 15" "iOS17.0"

# Criar iPhone 14 com iOS 16
xcrun simctl create "iPhone 14" "iPhone 14" "iOS16.0"
```

## 📂 Abrindo o Projeto

### Opção 1: Via Xcode

1. **Abra o Xcode**
2. **Menu**: `File` → `Open`
3. **Navegue até**: `d:/dashboard/next-shadcn-admin-dashboard-main/ios-app/`
4. **Selecione**: `Package.swift` ou a pasta `CirurgiaoApp`
5. **Clique em "Open"**

### Opção 2: Via Terminal

```bash
# Navegar até o diretório
cd d:/dashboard/next-shadcn-admin-dashboard-main/ios-app

# Abrir no Xcode
open Package.swift

# Ou
xed .
```

### Opção 3: Duplo Clique

No Finder, navegue até a pasta `ios-app` e dê duplo clique em `Package.swift`.

## 🏃 Executando o App

### 1. Aguardar Indexação

Na primeira vez que abrir o projeto:
- Xcode vai indexar os arquivos (barra de progresso no topo)
- Aguarde até completar (1-5 minutos)

### 2. Selecionar Simulador

Na barra superior do Xcode:
1. Clique no menu de dispositivos (ao lado do botão Play)
2. Selecione um simulador (ex: "iPhone 15")

### 3. Executar o App

**Opção A - Via Interface:**
- Clique no botão **▶️ Play** (ou `Cmd + R`)

**Opção B - Via Terminal:**
```bash
# Build e executar
xcodebuild -scheme CirurgiaoApp \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  build

# Executar no simulador
xcrun simctl boot "iPhone 15"
xcrun simctl install booted ./build/CirurgiaoApp.app
xcrun simctl launch booted com.projeto-cirurgiao.app
```

### 4. Aguardar Build

- Primeira build pode levar 2-5 minutos
- Builds subsequentes são mais rápidas (30s-1min)
- O simulador abrirá automaticamente

## 🧪 Executando Testes

### Via Xcode (Recomendado)

#### Executar Todos os Testes:

1. **Menu**: `Product` → `Test`
2. **Ou pressione**: `Cmd + U`
3. **Aguarde**: Testes serão executados
4. **Resultado**: Aparecerá no painel lateral

#### Executar Teste Específico:

1. **Abra**: `CirurgiaoAppTests/AuthViewModelTests.swift`
2. **Clique no diamante** ao lado do nome do teste
3. **Ou**: `Ctrl + Cmd + U` no teste específico

#### Ver Resultados:

1. **Menu**: `View` → `Navigators` → `Show Test Navigator`
2. **Ou pressione**: `Cmd + 6`
3. **Veja**: ✅ Passou | ❌ Falhou

### Via Terminal

```bash
# Navegar até o diretório
cd d:/dashboard/next-shadcn-admin-dashboard-main/ios-app

# Executar todos os testes
xcodebuild test \
  -scheme CirurgiaoApp \
  -destination 'platform=iOS Simulator,name=iPhone 15'

# Executar testes específicos
xcodebuild test \
  -scheme CirurgiaoApp \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  -only-testing:CirurgiaoAppTests/AuthViewModelTests

# Com output detalhado
xcodebuild test \
  -scheme CirurgiaoApp \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  -verbose
```

### Testes Disponíveis

```swift
// AuthViewModelTests
✅ testInitialState()
✅ testLoginWithEmptyCredentials()
✅ testLoginSetsLoadingState()
✅ testLogout()
✅ testErrorMessageClearing()

// KeychainManagerTests
✅ testSaveAndRetrieveAccessToken()
✅ testSaveAndRetrieveRefreshToken()
✅ testDeleteAccessToken()
✅ testDeleteAllTokens()
✅ testOverwriteToken()

// UserModelTests
✅ testUserDecoding()
✅ testUserRoleDecoding()
```

## 🎯 Testando a Autenticação

### 1. Iniciar Backend

Antes de testar o app, certifique-se que o backend está rodando:

```bash
cd d:/dashboard/next-shadcn-admin-dashboard-main/backend-api
npm run start:dev
```

Backend deve estar em: `http://localhost:3000`

### 2. Executar App no Simulador

1. Selecione um simulador
2. Pressione `Cmd + R`
3. Aguarde o app abrir

### 3. Testar Fluxos

#### Login:
1. Digite email: `test@example.com`
2. Digite senha: `password123`
3. Clique em "Entrar"
4. Deve navegar para o Dashboard

#### Registro:
1. Clique em "Criar nova conta"
2. Preencha os dados
3. Selecione tipo de usuário
4. Clique em "Criar Conta"
5. Deve criar conta e fazer login

#### Recuperação de Senha:
1. Clique em "Esqueci minha senha"
2. Digite email
3. Clique em "Enviar Email"
4. Deve mostrar mensagem de sucesso

## 🐛 Troubleshooting

### Problema: "No simulators available"

**Solução:**
```bash
# Listar simuladores
xcrun simctl list devices

# Se vazio, instalar via Xcode Settings → Platforms
```

### Problema: "Command Line Tools not found"

**Solução:**
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
xcode-select --install
```

### Problema: Build falha com erro de dependências

**Solução:**
```bash
# Limpar build
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Reabrir projeto
xed .
```

### Problema: Simulador não abre

**Solução:**
```bash
# Resetar simulador
xcrun simctl shutdown all
xcrun simctl erase all

# Reiniciar
xcrun simctl boot "iPhone 15"
```

### Problema: "Unable to boot device"

**Solução:**
```bash
# Matar processos do simulador
killall Simulator

# Tentar novamente
open -a Simulator
```

### Problema: Testes falham com erro de rede

**Solução:**
1. Verifique se o backend está rodando
2. Verifique a URL em `APIClient.swift`
3. Certifique-se que está usando `http://localhost:3000`

### Problema: Firebase não configurado

**Solução:**
1. Verifique se `GoogleService-Info.plist` existe em `Resources/`
2. Se não, copie de `iOS/GoogleService-Info.plist`

## 📊 Comandos Úteis

### Gerenciar Simuladores

```bash
# Listar todos
xcrun simctl list

# Bootar simulador
xcrun simctl boot "iPhone 15"

# Desligar todos
xcrun simctl shutdown all

# Resetar simulador específico
xcrun simctl erase "iPhone 15"

# Deletar simulador
xcrun simctl delete "iPhone 15"

# Tirar screenshot
xcrun simctl io booted screenshot screenshot.png

# Gravar vídeo
xcrun simctl io booted recordVideo video.mp4
```

### Logs e Debug

```bash
# Ver logs do simulador
xcrun simctl spawn booted log stream --level debug

# Ver logs do app
xcrun simctl spawn booted log stream --predicate 'processImagePath contains "CirurgiaoApp"'

# Limpar logs
xcrun simctl spawn booted log erase
```

### Build e Clean

```bash
# Clean build
xcodebuild clean -scheme CirurgiaoApp

# Build sem executar
xcodebuild build -scheme CirurgiaoApp

# Archive (para distribuição)
xcodebuild archive -scheme CirurgiaoApp
```

## 🎓 Dicas Importantes

### Performance

1. **Feche apps não usados** - Xcode consome muita RAM
2. **Use SSD** - Build é muito mais rápido
3. **Primeira build é lenta** - Builds subsequentes são rápidas
4. **Indexação** - Aguarde completar antes de editar

### Atalhos Úteis

- `Cmd + R` - Run (executar)
- `Cmd + U` - Test (testar)
- `Cmd + B` - Build (compilar)
- `Cmd + .` - Stop (parar)
- `Cmd + Shift + K` - Clean
- `Cmd + 0` - Toggle Navigator
- `Cmd + 6` - Test Navigator
- `Cmd + 9` - Show Reports

### Boas Práticas

1. **Sempre limpe** antes de builds importantes
2. **Use simuladores** para desenvolvimento
3. **Teste em dispositivo real** antes de produção
4. **Mantenha Xcode atualizado**
5. **Faça backup** do projeto regularmente

## 📞 Suporte

### Recursos Oficiais

- **Documentação Xcode**: https://developer.apple.com/documentation/xcode
- **Simuladores**: https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device
- **Swift**: https://swift.org/documentation/

### Comunidade

- **Stack Overflow**: Tag `xcode`, `ios`, `swift`
- **Apple Developer Forums**: https://developer.apple.com/forums/
- **Swift Forums**: https://forums.swift.org/

## ✅ Checklist de Verificação

Antes de começar a desenvolver:

- [ ] Xcode instalado e atualizado
- [ ] Command Line Tools instalados
- [ ] Simulador iOS 16+ instalado
- [ ] Projeto abre sem erros
- [ ] Build completa com sucesso
- [ ] App executa no simulador
- [ ] Testes passam
- [ ] Backend rodando em localhost:3000
- [ ] Firebase configurado

## 🎉 Pronto!

Agora você está pronto para desenvolver e testar o app iOS!

Para começar:
```bash
cd d:/dashboard/next-shadcn-admin-dashboard-main/ios-app
xed .
```

Pressione `Cmd + R` e comece a desenvolver! 🚀
