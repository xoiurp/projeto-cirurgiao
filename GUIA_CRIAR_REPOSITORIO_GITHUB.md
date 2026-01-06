# 🐙 Guia: Criar Repositório GitHub e Upload do Projeto

Guia passo a passo para criar repositório no GitHub e fazer upload do projeto.

## 🎯 Por que usar GitHub?

- ✅ Facilita transferência para o Mac
- ✅ Backup automático do código
- ✅ Controle de versão
- ✅ GitHub Actions gratuito para testes
- ✅ Colaboração em equipe

## 📋 Pré-requisitos

- Conta no GitHub (gratuita)
- Git instalado no Windows

### Verificar se Git está instalado

```bash
git --version
```

Se não estiver instalado, baixe em: https://git-scm.com/download/win

## 🚀 Passo a Passo

### Etapa 1: Criar Conta no GitHub (5 minutos)

1. Acesse: https://github.com/
2. Clique em **"Sign up"**
3. Preencha:
   - Email
   - Senha
   - Username (ex: `seu-usuario`)
4. Verifique email
5. Escolha plano **Free** (gratuito)

### Etapa 2: Criar Repositório no GitHub (2 minutos)

1. **Faça login** no GitHub
2. Clique no **"+"** (canto superior direito)
3. Selecione **"New repository"**

4. **Preencha os dados:**
   - **Repository name**: `projeto-cirurgiao`
   - **Description**: `Sistema de gestão cirúrgica - iOS, Android e Web`
   - **Visibility**: 
     - ✅ **Private** (recomendado para projetos comerciais)
     - ou **Public** (se quiser código aberto)
   - **NÃO marque** "Initialize with README" (já temos arquivos)
   - **NÃO adicione** .gitignore (já temos)
   - **NÃO adicione** license (por enquanto)

5. Clique em **"Create repository"**

6. **Copie a URL** que aparece (algo como):
   ```
   https://github.com/seu-usuario/projeto-cirurgiao.git
   ```

### Etapa 3: Preparar Projeto no Windows (5 minutos)

#### 3.1 Abrir PowerShell

1. Pressione `Win + X`
2. Selecione **"Windows PowerShell"** ou **"Terminal"**

#### 3.2 Navegar até o Projeto

```bash
cd d:\dashboard\next-shadcn-admin-dashboard-main
```

#### 3.3 Verificar Git

```bash
git --version
```

Se não tiver Git instalado:
1. Baixe: https://git-scm.com/download/win
2. Instale com opções padrão
3. Reinicie o PowerShell

#### 3.4 Configurar Git (Primeira Vez)

```bash
# Configurar nome
git config --global user.name "Seu Nome"

# Configurar email (use o mesmo do GitHub)
git config --global user.email "seu@email.com"

# Verificar configuração
git config --list
```

### Etapa 4: Inicializar Repositório Local (2 minutos)

```bash
# Inicializar Git (se ainda não foi feito)
git init

# Verificar status
git status
```

### Etapa 5: Criar .gitignore (Importante!)

Vamos criar um arquivo para ignorar arquivos desnecessários:

```bash
# Criar .gitignore
notepad .gitignore
```

Cole este conteúdo no Notepad:

```gitignore
# Node modules
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.*.local
*.env

# Build outputs
dist/
build/
.next/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
desktop.ini

# Logs
logs/
*.log

# Database
*.sqlite
*.db

# Temporary files
tmp/
temp/
*.tmp

# iOS
ios-app/.build/
ios-app/DerivedData/
*.xcuserstate
*.xcworkspace/xcuserdata/

# Android
android-app/.gradle/
android-app/build/
android-app/local.properties
android-app/.idea/
android-app/*.iml

# Sensitive data
gcp-service-account-key/
*.pem
*.key
credentials/
```

Salve e feche o Notepad.

### Etapa 6: Adicionar Arquivos ao Git (3 minutos)

```bash
# Adicionar todos os arquivos
git add .

# Verificar o que será commitado
git status

# Fazer primeiro commit
git commit -m "Initial commit: Projeto Cirurgião - iOS, Android e Web"
```

### Etapa 7: Conectar ao GitHub (2 minutos)

```bash
# Adicionar repositório remoto (substitua pela SUA URL)
git remote add origin https://github.com/xoiurp/projeto-cirurgiao.git

# Verificar
git remote -v
```

### Etapa 8: Fazer Upload (Push) (5 minutos)

```bash
# Renomear branch para main (se necessário)
git branch -M main

# Fazer push
git push -u origin main
```

**Se pedir autenticação:**

#### Opção A: Via Token (Recomendado)

1. No GitHub, vá em: **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Dê um nome: `projeto-cirurgiao-token`
4. Marque: `repo` (acesso completo ao repositório)
5. Clique em **"Generate token"**
6. **COPIE O TOKEN** (você não verá novamente!)
7. Use o token como senha quando o Git pedir

#### Opção B: Via GitHub CLI

```bash
# Instalar GitHub CLI
winget install GitHub.cli

# Fazer login
gh auth login

# Seguir instruções na tela
```

### Etapa 9: Verificar Upload (1 minuto)

1. Acesse: `https://github.com/seu-usuario/projeto-cirurgiao`
2. Você deve ver todos os arquivos do projeto!
3. ✅ Sucesso!

## 🎉 Pronto! Agora no Mac...

### No MacinCloud, execute:

```bash
# Abrir Terminal
cd ~/Desktop

# Clonar repositório
git clone https://github.com/seu-usuario/projeto-cirurgiao.git

# Entrar na pasta
cd projeto-cirurgiao

# Pronto! Projeto está no Mac
```

## 📝 Comandos Git Úteis

### Fazer Mudanças e Atualizar

```bash
# Ver status
git status

# Adicionar mudanças
git add .

# Commit
git commit -m "Descrição das mudanças"

# Push para GitHub
git push
```

### Baixar Mudanças

```bash
# Pull (baixar atualizações)
git pull
```

### Ver Histórico

```bash
# Ver commits
git log

# Ver commits resumidos
git log --oneline
```

### Branches

```bash
# Criar nova branch
git checkout -b feature/nova-funcionalidade

# Mudar de branch
git checkout main

# Listar branches
git branch
```

## 🔐 Segurança

### Arquivos Sensíveis

**NUNCA faça commit de:**
- ❌ Senhas
- ❌ API Keys
- ❌ Tokens
- ❌ Arquivos .env com dados reais
- ❌ Credenciais do banco de dados

**Use .env.example** para templates:

```bash
# .env.example (pode commitar)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-here

# .env (NÃO commitar - está no .gitignore)
DATABASE_URL=postgresql://real_user:real_pass@real_host:5432/real_db
JWT_SECRET=actual-secret-token-here
```

## 💡 Dicas

### 1. Commits Frequentes

```bash
# Faça commits pequenos e frequentes
git add .
git commit -m "feat: adiciona tela de login"
git push
```

### 2. Mensagens Descritivas

```
✅ Bom: "feat: adiciona autenticação com JWT"
✅ Bom: "fix: corrige erro no login"
✅ Bom: "docs: atualiza README com instruções"

❌ Ruim: "update"
❌ Ruim: "changes"
❌ Ruim: "fix"
```

### 3. Sincronizar Windows ↔ Mac

```bash
# No Windows (após fazer mudanças)
git add .
git commit -m "Descrição"
git push

# No Mac (para baixar mudanças)
git pull
```

## 🐛 Troubleshooting

### Erro: "Permission denied"

**Solução:**
```bash
# Usar token de acesso pessoal
# Quando pedir senha, use o token do GitHub
```

### Erro: "Repository not found"

**Solução:**
```bash
# Verificar URL
git remote -v

# Corrigir URL se necessário
git remote set-url origin https://github.com/seu-usuario/projeto-cirurgiao.git
```

### Erro: "Failed to push"

**Solução:**
```bash
# Fazer pull primeiro
git pull origin main

# Resolver conflitos se houver
# Depois fazer push
git push origin main
```

### Arquivos Grandes

Se tiver arquivos muito grandes (>100MB):

```bash
# Usar Git LFS
git lfs install
git lfs track "*.zip"
git lfs track "*.apk"
git add .gitattributes
git commit -m "Add Git LFS"
```

## 📊 Estrutura Final

Após o push, seu repositório terá:

```
projeto-cirurgiao/
├── .github/
│   └── workflows/
│       └── ios-tests.yml
├── ios-app/
├── android-app/
├── backend-api/
├── frontend-web/
├── docs/
├── scripts/
├── .gitignore
├── README.md
└── ... outros arquivos
```

## ✅ Checklist

- [ ] Conta GitHub criada
- [ ] Repositório criado no GitHub
- [ ] Git instalado no Windows
- [ ] Git configurado (nome e email)
- [ ] .gitignore criado
- [ ] Arquivos adicionados (git add)
- [ ] Primeiro commit feito
- [ ] Repositório remoto adicionado
- [ ] Push realizado com sucesso
- [ ] Arquivos visíveis no GitHub
- [ ] Pronto para clonar no Mac!

## 🎯 Próximos Passos

1. ✅ Repositório criado e código no GitHub
2. ✅ No Mac: `git clone https://github.com/seu-usuario/projeto-cirurgiao.git`
3. ✅ Abrir projeto no Xcode
4. ✅ Executar e testar!

## 📞 Comandos Resumidos

```bash
# Setup inicial (uma vez)
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/projeto-cirurgiao.git
git push -u origin main

# Workflow diário
git add .
git commit -m "Descrição das mudanças"
git push

# Baixar mudanças
git pull
```

Pronto! Agora você tem controle de versão profissional! 🚀
