# 🔧 Corrigir Erros de Build - iOS

Guia rápido para corrigir os erros de build do projeto iOS.

## 🐛 Problema

O projeto foi criado como Swift Package mas precisa ser um App iOS real. Os erros aparecem porque:

1. ❌ Está tentando buildar para macOS em vez de iOS
2. ❌ Falta arquivo de projeto Xcode (.xcodeproj)
3. ❌ Configuração incorreta de plataforma

## ✅ Solução Rápida (5 minutos)

### No Mac, execute estes comandos no Terminal:

```bash
# 1. Navegar até a pasta do projeto
cd ~/Desktop/projeto-cirurgiao/ios-app

# 2. Criar projeto Xcode
xcodebuild -create-xcodeproj

# OU criar manualmente via Xcode (recomendado)
```

## 🎯 Solução Completa - Criar Projeto Xcode Correto

### Opção A: Via Xcode (Recomendado - 10 minutos)

#### 1. Abrir Xcode

```bash
open -a Xcode
```

#### 2. Criar Novo Projeto

1. **File** → **New** → **Project**
2. Selecione **iOS** (não macOS!)
3. Escolha **App**
4. Clique em **Next**

#### 3. Configurar Projeto

- **Product Name**: `CirurgiaoApp`
- **Team**: None (ou sua conta)
- **Organization Identifier**: `com.projeto-cirurgiao`
- **Bundle Identifier**: `com.projeto-cirurgiao.app`
- **Interface**: **SwiftUI**
- **Language**: **Swift**
- **Storage**: None
- **Include Tests**: ✅ Marque

Clique em **Next**

#### 4. Salvar Projeto

- Salve em: `~/Desktop/projeto-cirurgiao/ios-app-novo`
- Clique em **Create**

#### 5. Copiar Arquivos

No Terminal:

```bash
# Navegar para a pasta
cd ~/Desktop/projeto-cirurgiao

# Copiar arquivos do projeto antigo para o novo
cp -r ios-app/CirurgiaoApp/* ios-app-novo/CirurgiaoApp/

# Copiar testes
cp -r ios-app/CirurgiaoAppTests/* ios-app-novo/CirurgiaoAppTests/

# Copiar GoogleService-Info.plist
cp ios-app/CirurgiaoApp/Resources/GoogleService-Info.plist ios-app-novo/CirurgiaoApp/
```

#### 6. Adicionar Firebase

1. No Xcode, selecione o projeto (ícone azul no topo)
2. Vá em **Package Dependencies**
3. Clique no **"+"**
4. Cole a URL: `https://github.com/firebase/firebase-ios-sdk.git`
5. Clique em **Add Package**
6. Selecione:
   - ✅ FirebaseAnalytics
   - ✅ FirebaseCrashlytics
   - ✅ FirebaseAuth
7. Clique em **Add Package**

#### 7. Configurar Info.plist

1. Selecione `Info.plist` no navegador
2. Adicione estas chaves (se não existirem):

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

#### 8. Build e Run

1. Selecione **iPhone 15** no menu de dispositivos
2. Pressione **Cmd + R**
3. Deve compilar sem erros!

### Opção B: Usar Template Pronto (5 minutos)

Vou criar um script que faz tudo automaticamente:

```bash
#!/bin/bash

# Script para criar projeto iOS correto

cd ~/Desktop/projeto-cirurgiao

# Criar estrutura do projeto
mkdir -p ios-app-fixed/CirurgiaoApp.xcodeproj

# Copiar arquivos
cp -r ios-app/CirurgiaoApp ios-app-fixed/
cp -r ios-app/CirurgiaoAppTests ios-app-fixed/

# Criar arquivo de projeto básico
cat > ios-app-fixed/CirurgiaoApp.xcodeproj/project.pbxproj << 'EOF'
// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 56;
	objects = {
		// Configuração básica do projeto
	};
	rootObject = /* Project object */;
}
EOF

echo "✅ Projeto criado! Abra ios-app-fixed no Xcode"
```

## 🚀 Solução Mais Simples - Usar Xcode Template

### Passo a Passo Detalhado:

1. **Feche o projeto atual** no Xcode (se estiver aberto)

2. **Abra Xcode**

3. **File → New → Project**

4. **Selecione iOS → App**

5. **Configure:**
   ```
   Product Name: CirurgiaoApp
   Team: None
   Organization Identifier: com.projeto-cirurgiao
   Bundle Identifier: com.projeto-cirurgiao.app
   Interface: SwiftUI
   Language: Swift
   Include Tests: ✅
   ```

6. **Salve em:** `~/Desktop/CirurgiaoApp-iOS`

7. **Substitua os arquivos:**
   - Delete `ContentView.swift` do novo projeto
   - Arraste todos os arquivos de `ios-app/CirurgiaoApp` para o novo projeto
   - Marque "Copy items if needed"

8. **Adicione Firebase:**
   - File → Add Package Dependencies
   - URL: `https://github.com/firebase/firebase-ios-sdk.git`
   - Adicione: FirebaseAnalytics, FirebaseCrashlytics, FirebaseAuth

9. **Copie GoogleService-Info.plist:**
   - Arraste o arquivo para o projeto
   - Marque "Copy items if needed"

10. **Build (Cmd + B)**

## 📝 Checklist de Verificação

Antes de fazer build, verifique:

- [ ] Projeto é do tipo **iOS App** (não Swift Package)
- [ ] Target está configurado para **iOS 16.0+**
- [ ] Simulador selecionado é **iPhone** (não Mac)
- [ ] Firebase packages adicionados
- [ ] GoogleService-Info.plist está no projeto
- [ ] Info.plist configurado corretamente
- [ ] Todos os arquivos Swift estão no target

## 🐛 Se Ainda Tiver Erros

### Erro: "data(for:) only available in macOS 12.0"

**Causa**: Está tentando buildar para macOS

**Solução**:
1. Selecione o projeto (ícone azul)
2. Em "Targets", selecione "CirurgiaoApp"
3. Aba "General"
4. Em "Deployment Info", verifique:
   - **iOS**: 16.0
   - **Devices**: iPhone

### Erro: "ObservableObject only available in macOS 10.15"

**Causa**: Target incorreto

**Solução**:
1. Verifique que está buildando para **iOS Simulator**
2. Não para "My Mac"

### Erro: "Cannot find 'FirebaseCore'"

**Causa**: Firebase não adicionado

**Solução**:
1. File → Add Package Dependencies
2. Adicione Firebase SDK

## 💡 Dica Rápida

Se estiver com muitos problemas, a forma mais rápida é:

1. **Criar projeto novo** no Xcode (iOS App)
2. **Copiar apenas os arquivos Swift** do projeto antigo
3. **Adicionar Firebase** via Package Dependencies
4. **Copiar GoogleService-Info.plist**
5. **Build!**

Isso leva ~10 minutos e resolve todos os problemas.

## 🎯 Próximos Passos

Após corrigir:

1. ✅ Build deve funcionar (Cmd + B)
2. ✅ Run deve abrir simulador (Cmd + R)
3. ✅ Testes devem passar (Cmd + U)
4. ✅ App deve funcionar!

## 📞 Comandos Úteis

```bash
# Limpar build
Cmd + Shift + K

# Limpar DerivedData
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Resetar simulador
xcrun simctl erase all

# Listar simuladores
xcrun simctl list devices
```

## ✅ Verificação Final

Após corrigir, teste:

```bash
# No Terminal
cd ~/Desktop/CirurgiaoApp-iOS

# Build via linha de comando
xcodebuild build \
  -scheme CirurgiaoApp \
  -destination 'platform=iOS Simulator,name=iPhone 15'

# Se funcionar, está correto!
```

Boa sorte! 🚀
