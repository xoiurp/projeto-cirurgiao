# 🏗️ Infraestrutura Local - Projeto Cirurgião

## 📚 Documentação Rápida

Bem-vindo à infraestrutura de desenvolvimento local do Projeto Cirurgião!

---

## 🚀 Quick Start

### 1. Pré-requisitos

- **Docker Desktop** instalado e rodando
- Se não tiver Docker instalado, consulte: [docs/INSTALACAO_DOCKER.md](docs/INSTALACAO_DOCKER.md)

### 2. Iniciar o Ambiente

```bash
cd scripts
start-dev.bat
```

### 3. Acessar os Serviços

- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **pgAdmin**: http://localhost:5050

---

## 📖 Documentação Completa

### 📄 Guias Disponíveis

1. **[INSTALACAO_DOCKER.md](docs/INSTALACAO_DOCKER.md)**
   - Como instalar o Docker Desktop no Windows
   - Requisitos do sistema
   - Troubleshooting de instalação

2. **[setup-local.md](docs/setup-local.md)**
   - Guia completo do ambiente local
   - Como conectar aos serviços
   - Troubleshooting de uso
   - Comandos úteis

---

## 🛠️ Scripts Disponíveis

Todos os scripts estão na pasta `scripts/`:

### `start-dev.bat`
Inicia o ambiente de desenvolvimento completo.

```bash
cd scripts
start-dev.bat
```

**O que faz:**
- ✅ Verifica se Docker está instalado e rodando
- ✅ Inicia PostgreSQL, Redis e pgAdmin
- ✅ Aguarda os serviços ficarem prontos
- ✅ Exibe informações de acesso

### `stop-dev.bat`
Para o ambiente de desenvolvimento (preserva dados).

```bash
cd scripts
stop-dev.bat
```

**O que faz:**
- 🛑 Para todos os containers
- 💾 Preserva todos os dados

### `reset-db.bat`
Reseta completamente o ambiente (⚠️ REMOVE TODOS OS DADOS!).

```bash
cd scripts
reset-db.bat
```

**O que faz:**
- ⚠️ Solicita confirmação
- 🛑 Para e remove todos os containers
- 🗑️ Remove todos os volumes (dados perdidos!)
- 🧹 Limpa imagens órfãs

---

## 🔌 Informações de Conexão

### PostgreSQL

```
Host: localhost
Porta: 5432
Database: projeto_cirurgiao
Usuário: postgres
Senha: postgres
Schema: cirurgiao
```

**Connection String:**
```
postgresql://postgres:postgres@localhost:5432/projeto_cirurgiao
```

### Redis

```
Host: localhost
Porta: 6379
Senha: redis_dev_password
```

**Connection String:**
```
redis://:redis_dev_password@localhost:6379
```

### pgAdmin (Interface Web)

```
URL: http://localhost:5050
Email: admin@projetocirurgiao.com
Senha: admin
```

---

## 📁 Estrutura de Arquivos

```
projeto-cirurgiao/
├── docker-compose.yml              # Configuração dos serviços Docker
├── README-INFRAESTRUTURA.md        # Este arquivo
│
├── scripts/                        # Scripts de gerenciamento
│   ├── init-db.sql                # Inicialização do banco
│   ├── start-dev.bat              # Iniciar ambiente
│   ├── stop-dev.bat               # Parar ambiente
│   └── reset-db.bat               # Resetar ambiente
│
└── docs/                           # Documentação
    ├── INSTALACAO_DOCKER.md       # Guia de instalação do Docker
    └── setup-local.md             # Guia completo do ambiente local
```

---

## 🔧 Comandos Úteis

### Ver status dos containers

```bash
docker compose ps
```

### Ver logs

```bash
# Todos os serviços
docker compose logs

# Serviço específico
docker compose logs postgres
docker compose logs redis
docker compose logs pgadmin

# Seguir logs em tempo real
docker compose logs -f
```

### Acessar container

```bash
# PostgreSQL
docker exec -it projeto-cirurgiao-postgres psql -U postgres -d projeto_cirurgiao

# Redis
docker exec -it projeto-cirurgiao-redis redis-cli -a redis_dev_password
```

---

## ⚠️ Troubleshooting Rápido

### Docker não está instalado
👉 Consulte: [docs/INSTALACAO_DOCKER.md](docs/INSTALACAO_DOCKER.md)

### Docker não está rodando
👉 Abra o Docker Desktop e aguarde inicializar

### Porta já está em uso
👉 Verifique se há outro serviço usando a porta:
```bash
netstat -ano | findstr :5432
netstat -ano | findstr :6379
```

### Containers não iniciam
👉 Tente resetar o ambiente:
```bash
cd scripts
reset-db.bat
start-dev.bat
```

### Mais problemas?
👉 Consulte a seção de Troubleshooting em: [docs/setup-local.md](docs/setup-local.md)

---

## 🎯 Próximos Passos

Após configurar o ambiente:

1. ✅ Verifique se todos os serviços estão rodando
2. ✅ Configure suas variáveis de ambiente (`.env`)
3. ✅ Execute as migrations do banco (quando disponíveis)
4. ✅ Inicie o desenvolvimento! 🚀

---

## 📞 Suporte

Em caso de problemas:

1. Consulte a documentação em `docs/`
2. Verifique os logs dos containers
3. Entre em contato com a equipe DevOps

---

## 🔐 Segurança

⚠️ **IMPORTANTE**: As credenciais fornecidas são APENAS para desenvolvimento local!

**NUNCA** use estas credenciais em produção!

---

## 📝 Notas

- Os dados são persistidos em volumes Docker
- Para limpar completamente, use `reset-db.bat`
- O ambiente reinicia automaticamente após reboot do sistema
- Healthchecks garantem que os serviços estejam prontos

---

**Criado por**: DevOps Team - Projeto Cirurgião  
**Semana**: 2  
**Versão**: 1.0.0  
**Data**: Janeiro 2025
