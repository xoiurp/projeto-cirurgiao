# 🔧 Solução: Erro InvalidPathException

## Problema

```
java.nio.file.InvalidPathException: Illegal char <"> at index 119
```

Este erro ocorre quando o Android Studio tenta acessar um caminho com aspas extras ou caracteres inválidos.

## Solução Rápida: Sincronizar via Linha de Comando

Como o Android Studio está com problemas de configuração, vamos sincronizar o projeto diretamente via Gradle:

### Passo 1: Limpar Cache

```powershell
cd D:\dashboard\next-shadcn-admin-dashboard-main\android-app
if (Test-Path .gradle) { Remove-Item -Recurse -Force .gradle }
if (Test-Path build) { Remove-Item -Recurse -Force build }
if (Test-Path app\build) { Remove-Item -Recurse -Force app\build }
```

### Passo 2: Sincronizar Dependências

```powershell
.\gradlew.bat --refresh-dependencies
```

### Passo 3: Compilar o Projeto

```powershell
.\gradlew.bat assembleDebug
```

## Solução Alternativa: Reinstalar Android Studio

Se o problema persistir, pode ser necessário reinstalar o Android Studio:

### Opção 1: Instalação Limpa

1. **Desinstalar Android Studio**:
   - Painel de Controle → Programas → Desinstalar
   - Remova "Android Studio"

2. **Limpar Configurações**:
   ```powershell
   Remove-Item -Recurse -Force "$env:USERPROFILE\.android"
   Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle"
   Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Google\AndroidStudio*"
   Remove-Item -Recurse -Force "$env:APPDATA\Google\AndroidStudio*"
   ```

3. **Baixar Nova Versão**:
   - [Android Studio](https://developer.android.com/studio)
   - Instale em um caminho sem espaços: `C:\AndroidStudio`

4. **Configurar SDK**:
   - Durante instalação, escolha: `C:\Android\SDK`

### Opção 2: Usar IntelliJ IDEA

Como alternativa ao Android Studio:

1. **Baixar IntelliJ IDEA Community**:
   - [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)

2. **Instalar Plugin Android**:
   - File → Settings → Plugins
   - Busque "Android"
   - Instale e reinicie

3. **Abrir Projeto**:
   - File → Open
   - Selecione `D:\dashboard\next-shadcn-admin-dashboard-main\android-app`

## Solução Temporária: Editar Manualmente

Se precisar apenas editar código sem sincronizar:

1. **Abra o projeto como pasta**:
   - File → Open Folder
   - Selecione `android-app`

2. **Use VS Code**:
   - Instale extensão "Kotlin"
   - Edite os arquivos normalmente

3. **Compile via terminal**:
   ```powershell
   .\gradlew.bat assembleDebug
   ```

## Verificar Instalação do Gradle

```powershell
cd android-app
.\gradlew.bat --version
```

Deve mostrar:
```
Gradle 8.5
Kotlin: 1.9.20
JVM: 17.0.x
```

## Comandos Úteis

### Limpar e Compilar
```powershell
.\gradlew.bat clean assembleDebug
```

### Executar Testes
```powershell
.\gradlew.bat test
```

### Listar Tarefas
```powershell
.\gradlew.bat tasks
```

### Ver Dependências
```powershell
.\gradlew.bat dependencies
```

## Configuração Manual do JDK

Se o erro persistir, configure o JDK manualmente no `gradle.properties`:

1. Abra `android-app/gradle.properties`

2. Adicione (ajuste o caminho para seu JDK 17):
```properties
org.gradle.java.home=C\:\\Program Files\\Java\\jdk-17
```

3. Ou use o JDK do Android Studio:
```properties
org.gradle.java.home=C\:\\Program Files\\Android\\Android Studio\\jbr
```

## Próximos Passos

1. ✅ Tente sincronizar via linha de comando primeiro
2. ✅ Se funcionar, você pode desenvolver sem o Android Studio
3. ✅ Para usar emulador, instale Android SDK separadamente
4. ✅ Use `adb` para instalar APKs no dispositivo

## Instalar APK no Dispositivo

Após compilar:

```powershell
# Conecte o dispositivo via USB
adb devices

# Instale o APK
adb install app\build\outputs\apk\debug\app-debug.apk
```

## Alternativa: Usar Emulador via Linha de Comando

```powershell
# Listar emuladores
emulator -list-avds

# Iniciar emulador
emulator -avd Pixel_5_API_34

# Em outro terminal, instalar APK
adb install app\build\outputs\apk\debug\app-debug.apk
```

---

**Última Atualização**: 09/11/2025  
**Responsável**: ANDROID-SENIOR-01 (Marina)
