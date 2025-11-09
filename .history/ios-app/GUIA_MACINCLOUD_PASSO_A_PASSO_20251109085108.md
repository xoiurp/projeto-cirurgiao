# 🍎 Guia Completo: MacinCloud Passo a Passo

Guia detalhado para configurar e executar o projeto iOS no MacinCloud.

## 📋 Suas Credenciais

```
Hostname: LA617.macincloud.com
Username: user944995
Password: fut52846dhv
IP: 38.79.97.17
```

⚠️ **IMPORTANTE**: Guarde essas credenciais em local seguro!

## 🚀 Passo a Passo Completo

### Etapa 1: Instalar Xcode (30-60 minutos)

#### 1.1 Abrir App Store

1. Clique no ícone da **App Store** no Dock (parte inferior da tela)
2. Ou pressione `Cmd + Espaço` e digite "App Store"

#### 1.2 Buscar e Instalar Xcode

1. Na App Store, clique na **barra de busca** (canto superior esquerdo)
2. Digite: **Xcode**
3. Clique em **"Obter"** ou **"Instalar"**
4. Se pedir senha do Apple ID:
   - Use o Apple ID do MacinCloud (deve estar configurado)
   - Ou crie um Apple ID gratuito em: https://appleid.apple.com/

5. **Aguarde o download** (15-30 minutos)
   - Tamanho: ~15 GB
   - Você pode continuar usando o Mac enquanto baixa

#### 1.3 Primeira Execução do Xcode

1. Após instalação, abra o **Launchpad** (ícone de foguete no Dock)
2. Clique em **Xcode**
3. Na primeira execução:
   - Clique em **"Install"** para instalar componentes adicionais
   - Digite a senha: `fut52846dhv`
   - Aguarde instalação (5-10 minutos)

4. Aceite a licença:
   - Leia (ou role até o final)
   - Clique em **"Agree"**

### Etapa 2: Instalar Command Line Tools

#### 2.1 Via Terminal

1. Abra o **Terminal**:
   - Pressione `Cmd + Espaço`
   - Digite "Terminal"
   - Pressione Enter

2. Execute o comando:
```bash
xcode-select --install
```

3. Clique em **"Install"** na janela que aparecer
4. Aguarde (5-10 minutos)

#### 2.2 Verificar Instalação

No Terminal, execute:
```bash
xcode-select -p
```

Deve retornar:
```
/Applications/Xcode.app/Contents/Developer
```

E também:
```bash
xcodebuild -version
```

Deve mostrar algo como:
```
Xcode 15.x
Build version xxxxx
```

### Etapa 3: Transferir Projeto para o Mac

#### Opção A: Via GitHub (Recomendado)

1. **No Terminal do Mac**, execute:

```bash
# Navegar para Desktop
cd ~/Desktop

# Clonar repositório (substitua pela sua URL)
git clone https://github.com/seu-usuario/projeto-cirurgiao.git

# Entrar na pasta
cd projeto-cirurgiao
```

#### Opção B: Via Upload Direto

1. **No Windows**, comprima a pasta:
```bash
# No PowerShell do Windows
cd d:\dashboard\next-shadcn-admin-dashboard-main
Compress-Archive -Path ios-app -DestinationPath ios-app.zip
```

2. **No Mac**, use um dos métodos:

**Método 1: Via Navegador**
- Faça upload para Google Drive, Dropbox ou WeTransfer
- No Mac, baixe o arquivo
- Extraia com duplo clique

**Método 2: Via SCP (do Windows)**
```bash
# No PowerShell do Windows
scp -r ios-app user944995@38.79.97.17:~/Desktop/
# Senha: fut52846dhv
```

**Método 3: Via Compartilhamento de Tela**
- Arraste e solte arquivos pela interface VNC

### Etapa 4: Abrir Projeto no Xcode

#### 4.1 Abrir o Projeto

1. No **Finder** (ícone de rosto sorridente no Dock):
   - Vá para **Desktop**
   - Navegue até a pasta do projeto
   - Entre em `ios-app`

2. **Duplo clique** em `Package.swift`
   - Ou clique com botão direito → "Open With" → "Xcode"

3. **Aguarde a indexação** (primeira vez: 2-5 minutos)
   - Barra de progresso aparecerá no topo do Xcode
   - Não faça nada até completar

#### 4.2 Resolver Dependências

O Xcode deve resolver automaticamente. Se não:

1. No menu: **File** → **Packages** → **Resolve Package Versions**
2. Aguarde download das dependências (Firebase, etc.)

### Etapa 5: Instalar Simuladores iOS

#### 5.1 Via Xcode Settings

1. No menu: **Xcode** → **Settings** (ou **Preferences**)
2. Clique na aba **Platforms**
3. Procure por **iOS**
4. Clique no botão **"+"** ou **"Get"**
5. Selecione **iOS 17.x** (mais recente)
6. Clique em **"Download"**
7. Aguarde (2-5 GB, 10-20 minutos)

#### 5.2 Verificar Simuladores Instalados

No Terminal:
```bash
xcrun simctl list devices available
```

Deve listar vários iPhones e iPads.

### Etapa 6: Executar o App

#### 6.1 Selecionar Simulador

1. Na barra superior do Xcode, ao lado do botão ▶️ Play
2. Clique no menu de dispositivos
3. Selecione: **iPhone 15** (ou qualquer iPhone disponível)

#### 6.2 Build e Run

1. Pressione **`Cmd + R`** ou clique no botão **▶️ Play**
2. Aguarde o build (primeira vez: 2-5 minutos)
3. O simulador abrirá automaticamente
4. O app será instalado e executado

#### 6.3 O que Esperar

- ✅ Simulador do iPhone abre
- ✅ App "Projeto Cirurgião" aparece
- ✅ Tela de login é exibida
- ✅ Você pode interagir com o app

### Etapa 7: Executar Testes

#### 7.1 Via Interface do Xcode

1. No menu: **Product** → **Test**
2. Ou pressione: **`Cmd + U`**
3. Aguarde execução dos testes (1-2 minutos)

#### 7.2 Ver Resultados

1. Pressione **`Cmd + 6`** (Test Navigator)
2. Veja lista de testes:
   - ✅ Verde = Passou
   - ❌ Vermelho = Falhou

3. Clique em qualquer teste para ver detalhes

#### 7.3 Via Terminal (Alternativa)

```bash
cd ~/Desktop/projeto-cirurgiao/ios-app

xcodebuild test \
  -scheme CirurgiaoApp \
  -destination 'platform=iOS Simulator,name=iPhone 15'
```

### Etapa 8: Testar Autenticação

#### 8.1 Iniciar Backend (Se Necessário)

Se o backend não estiver rodando no seu Windows:

**No Mac**, você pode rodar localmente:

```bash
# Instalar Node.js (se não tiver)
brew install node

# Navegar para backend
cd ~/Desktop/projeto-cirurgiao/backend-api

# Instalar dependências
npm install

# Iniciar
npm run start:dev
```

Ou use o backend do Windows: `http://SEU_IP_WINDOWS:3000`

#### 8.2 Testar Login

1. No simulador, na tela de login:
   - Email: `test@example.com`
   - Senha: `password123`
   - Clique em "Entrar"

2. Deve navegar para o Dashboard

#### 8.3 Testar Registro

1. Clique em "Criar nova conta"
2. Preencha os dados
3. Selecione tipo de usuário
4. Clique em "Criar Conta"

### Etapa 9: Debug e Desenvolvimento

#### 9.1 Breakpoints

1. Clique na margem esquerda do código (número da linha)
2. Aparecerá um ponto azul
3. Execute o app (`Cmd + R`)
4. Quando chegar no breakpoint, execução pausa
5. Use os controles de debug na barra superior

#### 9.2 Console e Logs

1. Pressione **`Cmd + Shift + Y`** para mostrar console
2. Veja os `print()` do código
3. Veja erros e warnings

#### 9.3 Inspecionar Variáveis

1. Quando pausado em breakpoint
2. Passe mouse sobre variáveis
3. Ou veja no painel "Variables View" (lado esquerdo)

### Etapa 10: Atalhos Úteis do Xcode

```
Cmd + R          - Run (executar)
Cmd + .          - Stop (parar)
Cmd + B          - Build (compilar)
Cmd + U          - Test (testar)
Cmd + Shift + K  - Clean Build
Cmd + 0          - Toggle Navigator
Cmd + Shift + Y  - Toggle Console
Cmd + 6          - Test Navigator
Cmd + 9          - Show Reports
Cmd + /          - Comentar/Descomentar
Cmd + [          - Diminuir indentação
Cmd + ]          - Aumentar indentação
Cmd + F          - Find (buscar)
Cmd + Shift + F  - Find in Project
```

## 🎯 Checklist de Verificação

Marque conforme completa:

- [ ] Xcode instalado
- [ ] Command Line Tools instalados
- [ ] Projeto transferido para o Mac
- [ ] Projeto aberto no Xcode
- [ ] Dependências resolvidas
- [ ] Simulador iOS instalado
- [ ] App compilou sem erros
- [ ] App executou no simulador
- [ ] Testes executaram com sucesso
- [ ] Login funcionou
- [ ] Registro funcionou

## 🐛 Troubleshooting

### Problema: "No simulators available"

**Solução:**
```bash
# Listar simuladores
xcrun simctl list devices

# Se vazio, instalar via Xcode Settings → Platforms
```

### Problema: Build falha com erro de assinatura

**Solução:**
1. No Xcode, selecione o projeto (ícone azul no topo)
2. Aba "Signing & Capabilities"
3. Desmarque "Automatically manage signing"
4. Em "Team", selecione "None"

### Problema: Dependências não resolvem

**Solução:**
```bash
cd ~/Desktop/projeto-cirurgiao/ios-app
swift package resolve
swift package update
```

### Problema: Simulador não abre

**Solução:**
```bash
# Resetar simuladores
xcrun simctl shutdown all
xcrun simctl erase all

# Reiniciar
sudo killall -9 com.apple.CoreSimulator.CoreSimulatorService
```

### Problema: Xcode muito lento

**Solução:**
1. Feche outros apps
2. Limpe build: `Cmd + Shift + K`
3. Limpe DerivedData:
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

## 💡 Dicas Importantes

### Economize Tempo/Dinheiro

1. **Desligue quando não usar**
   - MacinCloud cobra por hora
   - Desligue o Mac quando terminar

2. **Use GitHub para sincronizar**
   - Commit no Mac
   - Pull no Windows
   - Não precisa transferir arquivos toda vez

3. **Desenvolva no Windows**
   - Use VSCode no Windows
   - Apenas teste no Mac
   - Economize horas de Mac

### Performance

1. **Primeira build é lenta** (2-5 min)
2. **Builds subsequentes são rápidas** (30s-1min)
3. **Aguarde indexação completar** antes de editar
4. **Use cache** do Swift Package Manager

### Boas Práticas

1. **Sempre faça Clean** antes de builds importantes
2. **Commit frequentemente** para não perder trabalho
3. **Teste em múltiplos simuladores** (iPhone, iPad)
4. **Use breakpoints** para debug eficiente

## 📞 Comandos Rápidos

### Gerenciar Simuladores

```bash
# Listar todos
xcrun simctl list

# Bootar simulador
xcrun simctl boot "iPhone 15"

# Desligar todos
xcrun simctl shutdown all

# Resetar simulador
xcrun simctl erase "iPhone 15"

# Screenshot
xcrun simctl io booted screenshot ~/Desktop/screenshot.png
```

### Build e Test

```bash
cd ~/Desktop/projeto-cirurgiao/ios-app

# Build
xcodebuild build -scheme CirurgiaoApp

# Test
xcodebuild test -scheme CirurgiaoApp \
  -destination 'platform=iOS Simulator,name=iPhone 15'

# Clean
xcodebuild clean -scheme CirurgiaoApp
```

### Git

```bash
# Status
git status

# Commit
git add .
git commit -m "Mensagem"

# Push
git push

# Pull
git pull
```

## 🎉 Pronto!

Agora você está pronto para desenvolver iOS no MacinCloud!

### Workflow Recomendado:

```
1. Desenvolva no Windows (VSCode)
2. Commit e push para GitHub
3. No Mac: git pull
4. Teste no Xcode
5. Se tudo OK, continue no Windows
6. Desligue o Mac para economizar
```

### Próximos Passos:

1. ✅ Execute o app no simulador
2. ✅ Execute os testes
3. ✅ Teste login e registro
4. ✅ Faça suas modificações
5. ✅ Commit e push
6. ✅ Desligue o Mac

Boa sorte! 🚀
