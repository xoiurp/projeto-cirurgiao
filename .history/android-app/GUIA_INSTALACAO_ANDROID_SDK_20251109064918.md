# 🔧 Guia de Instalação e Configuração do Android SDK

## ❌ Erro: "The Android SDK location cannot be at the filesystem root"

Este erro ocorre quando o Android Studio não consegue localizar o SDK ou ele está configurado incorretamente.

## ✅ Solução Passo a Passo

### 1. Verificar se o Android SDK está instalado

#### Windows:
```powershell
# Verificar se existe o diretório padrão do SDK
Test-Path "$env:LOCALAPPDATA\Android\Sdk"

# Ou verificar em outro local comum
Test-Path "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
```

#### Locais comuns do Android SDK:
- **Windows**: `C:\Users\[SEU_USUARIO]\AppData\Local\Android\Sdk`
- **Mac**: `~/Library/Android/sdk`
- **Linux**: `~/Android/Sdk`

### 2. Instalar o Android SDK (se não estiver instalado)

#### Opção A: Via Android Studio (Recomendado)

1. **Baixar Android Studio**:
   - Acesse: https://developer.android.com/studio
   - Baixe a versão mais recente
   - Execute o instalador

2. **Durante a instalação**:
   - Marque a opção "Android SDK"
   - Marque "Android SDK Platform"
   - Marque "Android Virtual Device"

3. **Após a instalação**:
   - Abra o Android Studio
   - Vá em: `File > Settings` (Windows/Linux) ou `Android Studio > Preferences` (Mac)
   - Navegue até: `Appearance & Behavior > System Settings > Android SDK`
   - Anote o caminho do "Android SDK Location"

#### Opção B: Via Command Line Tools (Avançado)

1. **Baixar Command Line Tools**:
   - Acesse: https://developer.android.com/studio#command-tools
   - Baixe o pacote para seu sistema operacional

2. **Extrair e configurar**:
   ```powershell
   # Windows - PowerShell
   # Criar diretório
   New-Item -ItemType Directory -Path "$env:LOCALAPPDATA\Android\Sdk" -Force
   
   # Extrair o arquivo baixado para:
   # C:\Users\[SEU_USUARIO]\AppData\Local\Android\Sdk\cmdline-tools\latest
   ```

3. **Instalar componentes necessários**:
   ```powershell
   # Navegar até o diretório
   cd "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin"
   
   # Aceitar licenças
   .\sdkmanager.bat --licenses
   
   # Instalar componentes
   .\sdkmanager.bat "platform-tools" "platforms;android-34" "build-tools;34.0.0"
   ```

### 3. Configurar o local.properties

Crie ou edite o arquivo `local.properties` na raiz do projeto Android:

```properties
# Windows (ajuste o caminho para o seu usuário)
sdk.dir=C\:\\Users\\Pichau\\AppData\\Local\\Android\\Sdk

# Mac
# sdk.dir=/Users/[SEU_USUARIO]/Library/Android/sdk

# Linux
# sdk.dir=/home/[SEU_USUARIO]/Android/Sdk
```

**IMPORTANTE**: 
- Use `\\` (barra dupla invertida) no Windows
- Use `/` (barra normal) no Mac/Linux
- Substitua `[SEU_USUARIO]` pelo seu nome de usuário

### 4. Configurar Variáveis de Ambiente (Opcional mas Recomendado)

#### Windows:

1. **Abrir Variáveis de Ambiente**:
   - Pressione `Win + R`
   - Digite `sysdm.cpl` e pressione Enter
   - Vá na aba "Avançado"
   - Clique em "Variáveis de Ambiente"

2. **Adicionar ANDROID_HOME**:
   - Em "Variáveis do usuário", clique em "Novo"
   - Nome: `ANDROID_HOME`
   - Valor: `C:\Users\Pichau\AppData\Local\Android\Sdk`

3. **Adicionar ao PATH**:
   - Selecione a variável "Path" e clique em "Editar"
   - Clique em "Novo" e adicione:
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\tools`
     - `%ANDROID_HOME%\tools\bin`

4. **Verificar**:
   ```powershell
   # Abrir novo PowerShell e testar
   adb version
   ```

### 5. Verificar Instalação do SDK

Execute estes comandos para verificar:

```powershell
# Verificar se o diretório existe
Test-Path "$env:LOCALAPPDATA\Android\Sdk"

# Listar conteúdo
Get-ChildItem "$env:LOCALAPPDATA\Android\Sdk"

# Verificar plataformas instaladas
Get-ChildItem "$env:LOCALAPPDATA\Android\Sdk\platforms"

# Verificar build-tools
Get-ChildItem "$env:LOCALAPPDATA\Android\Sdk\build-tools"
```

### 6. Componentes Necessários

Certifique-se de ter instalado:

- ✅ **Android SDK Platform 34** (Android 14)
- ✅ **Android SDK Build-Tools 34.0.0**
- ✅ **Android SDK Platform-Tools**
- ✅ **Android SDK Tools**
- ✅ **Android Emulator** (para testes)

### 7. Abrir o Projeto no Android Studio

1. **Abrir Android Studio**
2. **Selecionar**: `Open an Existing Project`
3. **Navegar até**: `d:\dashboard\next-shadcn-admin-dashboard-main\android-app`
4. **Aguardar**: Gradle Sync automático
5. **Se aparecer erro de SDK**:
   - Vá em `File > Project Structure`
   - Em "SDK Location", configure o caminho correto
   - Clique em "Apply" e "OK"

### 8. Resolver Problemas Comuns

#### Erro: "SDK location not found"

**Solução**:
```powershell
# Criar o arquivo local.properties
cd d:\dashboard\next-shadcn-admin-dashboard-main\android-app
New-Item -ItemType File -Path "local.properties" -Force

# Adicionar conteúdo (ajuste o caminho)
Add-Content -Path "local.properties" -Value "sdk.dir=C\:\\Users\\Pichau\\AppData\\Local\\Android\\Sdk"
```

#### Erro: "Failed to install the following Android SDK packages"

**Solução**:
1. Abra Android Studio
2. Vá em `Tools > SDK Manager`
3. Marque os componentes faltantes
4. Clique em "Apply"

#### Erro: "Gradle sync failed"

**Solução**:
```powershell
# Limpar cache do Gradle
cd d:\dashboard\next-shadcn-admin-dashboard-main\android-app
Remove-Item -Recurse -Force .gradle
.\gradlew clean
```

### 9. Testar a Instalação

```powershell
# Verificar ADB
adb version

# Listar dispositivos conectados
adb devices

# Verificar SDK Manager
sdkmanager --list
```

### 10. Criar Emulador (AVD)

1. **No Android Studio**:
   - Vá em `Tools > Device Manager`
   - Clique em "Create Device"
   - Selecione um dispositivo (ex: Pixel 6)
   - Selecione uma imagem do sistema (ex: Android 14 - API 34)
   - Clique em "Finish"

2. **Via Command Line**:
   ```powershell
   # Listar imagens disponíveis
   sdkmanager --list | Select-String "system-images"
   
   # Baixar imagem
   sdkmanager "system-images;android-34;google_apis;x86_64"
   
   # Criar AVD
   avdmanager create avd -n "Pixel_6_API_34" -k "system-images;android-34;google_apis;x86_64" -d "pixel_6"
   ```

## 📋 Checklist Final

- [ ] Android Studio instalado
- [ ] Android SDK instalado em local válido
- [ ] Arquivo `local.properties` criado com caminho correto
- [ ] Variáveis de ambiente configuradas (ANDROID_HOME)
- [ ] Componentes do SDK instalados (Platform 34, Build-Tools, etc)
- [ ] Projeto abre sem erros no Android Studio
- [ ] Gradle sync completa com sucesso
- [ ] Emulador criado e funcionando

## 🆘 Precisa de Ajuda?

Se ainda tiver problemas, execute este comando e me envie o resultado:

```powershell
# Coletar informações do sistema
@"
=== Informações do Sistema ===
Android Studio: $(Test-Path "C:\Program Files\Android\Android Studio")
SDK Path: $(Test-Path "$env:LOCALAPPDATA\Android\Sdk")
ANDROID_HOME: $env:ANDROID_HOME
Java Version: $(java -version 2>&1 | Select-Object -First 1)

=== Conteúdo do SDK ===
$(Get-ChildItem "$env:LOCALAPPDATA\Android\Sdk" -ErrorAction SilentlyContinue | Select-Object Name)

=== Plataformas Instaladas ===
$(Get-ChildItem "$env:LOCALAPPDATA\Android\Sdk\platforms" -ErrorAction SilentlyContinue | Select-Object Name)
"@
```

## 📚 Links Úteis

- [Android Studio Download](https://developer.android.com/studio)
- [SDK Command-line Tools](https://developer.android.com/studio#command-tools)
- [Documentação Oficial](https://developer.android.com/studio/intro)
- [Troubleshooting Guide](https://developer.android.com/studio/troubleshoot)
