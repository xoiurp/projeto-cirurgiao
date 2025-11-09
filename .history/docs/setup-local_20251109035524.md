# 🚀 Setup do Ambiente Local de Desenvolvimento

## Projeto Cirurgião - Infraestrutura Local

Este guia descreve como configurar e utilizar o ambiente de desenvolvimento local do Projeto Cirurgião.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker Desktop** (versão 20.10 ou superior)
  - Download: https://www.docker.com/products/docker-desktop
  - Certifique-se de que o Docker está rodando antes de executar os scripts

- **Git** (para clonar o repositório)

---

## 🏗️ Arquitetura do Ambiente

O ambiente local é composto por 3 serviços principais:

### 1. PostgreSQL 15
- **Porta**: 5432
- **Database**: projeto_cirurgiao
- **Usuário**: postgres
- **Senha**: postgres
- **Schema**: cirurgiao
- **Extensões**: uuid-ossp, pg_trgm
- **Timezone**: America/Sao_Paulo

### 2. Redis 7
- **Porta**: 6379
- **Senha**: redis_dev_password
- **Persistência**: Habilitada (AOF)

### 3. pgAdmin 4 (Opcional)
- **Porta**: 5050 (HTTP)
- **URL**: http://localhost:5050
- **Email**: admin@projetocirurgiao.com
- **Senha**: admin

---

## 🚀 Como Iniciar o Ambiente

### Opção 1: Usando o Script (Recomendado)

```bash
# No diretório raiz do projeto
cd scripts
start-dev.bat
```

O script irá:
1. ✅ Verificar se o Docker está rodando
2. ✅ Iniciar todos os containers
3. ✅ Aguardar os serviços ficarem prontos
4. ✅ Exibir informações de acesso

### Opção 2: Usando Docker Compose Diretamente

```bash
# No diretório raiz do projeto
docker-compose up -d
```

---

## 🛑 Como Parar o Ambiente

### Opção 1: Usando o Script (Recomendado)

```bash
cd scripts
stop-dev.bat
```

### Opção 2: Usando Docker Compose Diretamente

```bash
docker-compose stop
```

**NOTA**: Os dados são preservados quando você para os containers.

---

## 🔄 Como Resetar o Banco de Dados

⚠️ **ATENÇÃO**: Este comando remove TODOS os dados!

### Usando o Script

```bash
cd scripts
reset-db.bat
```

O script irá:
1. ⚠️ Solicitar confirmação
2. 🛑 Parar todos os containers
3. 🗑️ Remover todos os volumes (dados perdidos!)
4. 🧹 Limpar imagens órfãs

Após o reset, execute `start-dev.bat` para recriar o ambiente.

---

## 🔌 Como Conectar aos Serviços

### PostgreSQL

#### Via Linha de Comando (psql)

```bash
# Se você tem psql instalado localmente
psql -h localhost -p 5432 -U postgres -d projeto_cirurgiao
# Senha: postgres
```

#### Via pgAdmin (Interface Web)

1. Acesse: http://localhost:5050
2. Login:
   - Email: `admin@projetocirurgiao.com`
   - Senha: `admin`
3. Adicionar servidor:
   - Nome: `Projeto Cirurgião Local`
   - Host: `postgres` (nome do container) ou `host.docker.internal`
   - Porta: `5432`
   - Database: `projeto_cirurgiao`
   - Usuário: `postgres`
   - Senha: `postgres`

#### Via Aplicação (Connection String)

```
postgresql://postgres:postgres@localhost:5432/projeto_cirurgiao
```

### Redis

#### Via redis-cli

```bash
# Se você tem redis-cli instalado localmente
redis-cli -h localhost -p 6379 -a redis_dev_password
```

#### Via Aplicação (Connection String)

```
redis://:redis_dev_password@localhost:6379
```

---

## 📊 Verificar Status dos Serviços

```bash
# Ver status de todos os containers
docker-compose ps

# Ver logs de todos os serviços
docker-compose logs

# Ver logs de um serviço específico
docker-compose logs postgres
docker-compose logs redis
docker-compose logs pgadmin

# Seguir logs em tempo real
docker-compose logs -f
```

---

## 🔧 Troubleshooting

### Problema: "Docker não está rodando"

**Solução**: 
1. Abra o Docker Desktop
2. Aguarde até que o Docker esteja completamente iniciado
3. Execute o script novamente

### Problema: "Porta 5432 já está em uso"

**Solução**:
1. Verifique se há outro PostgreSQL rodando localmente:
   ```bash
   netstat -ano | findstr :5432
   ```
2. Pare o serviço conflitante ou altere a porta no `docker-compose.yml`

### Problema: "Porta 6379 já está em uso"

**Solução**:
1. Verifique se há outro Redis rodando localmente:
   ```bash
   netstat -ano | findstr :6379
   ```
2. Pare o serviço conflitante ou altere a porta no `docker-compose.yml`

### Problema: "Containers não iniciam"

**Solução**:
1. Verifique os logs:
   ```bash
   docker-compose logs
   ```
2. Tente resetar o ambiente:
   ```bash
   cd scripts
   reset-db.bat
   start-dev.bat
   ```

### Problema: "Não consigo conectar ao PostgreSQL"

**Solução**:
1. Verifique se o container está rodando:
   ```bash
   docker-compose ps
   ```
2. Verifique os logs do PostgreSQL:
   ```bash
   docker-compose logs postgres
   ```
3. Aguarde alguns segundos após iniciar (healthcheck)
4. Tente conectar novamente

### Problema: "pgAdmin não carrega"

**Solução**:
1. Aguarde 30-60 segundos após iniciar (pgAdmin demora para inicializar)
2. Limpe o cache do navegador
3. Tente acessar em modo anônimo/privado
4. Verifique os logs:
   ```bash
   docker-compose logs pgadmin
   ```

---

## 📁 Estrutura de Arquivos

```
projeto-cirurgiao/
├── docker-compose.yml          # Configuração dos serviços
├── scripts/
│   ├── init-db.sql            # Script de inicialização do banco
│   ├── start-dev.bat          # Iniciar ambiente
│   ├── stop-dev.bat           # Parar ambiente
│   └── reset-db.bat           # Resetar banco de dados
└── docs/
    └── setup-local.md         # Esta documentação
```

---

## 🔐 Credenciais de Desenvolvimento

⚠️ **IMPORTANTE**: Estas credenciais são APENAS para desenvolvimento local!

### PostgreSQL
- **Usuário**: postgres
- **Senha**: postgres
- **Database**: projeto_cirurgiao

### Redis
- **Senha**: redis_dev_password

### pgAdmin
- **Email**: admin@projetocirurgiao.com
- **Senha**: admin

**NUNCA** use estas credenciais em produção!

---

## 🎯 Próximos Passos

Após configurar o ambiente local:

1. ✅ Verifique se todos os serviços estão rodando
2. ✅ Teste a conexão com PostgreSQL
3. ✅ Teste a conexão com Redis
4. ✅ Configure suas variáveis de ambiente (.env)
5. ✅ Execute as migrations do banco (quando disponíveis)
6. ✅ Inicie o desenvolvimento! 🚀

---

## 📞 Suporte

Em caso de problemas:

1. Consulte a seção de **Troubleshooting** acima
2. Verifique os logs dos containers
3. Entre em contato com a equipe DevOps

---

## 📝 Notas Importantes

- Os dados são persistidos em volumes Docker
- Para limpar completamente, use `reset-db.bat`
- O ambiente é reiniciado automaticamente após reboot (restart: unless-stopped)
- Healthchecks garantem que os serviços estejam prontos antes de aceitar conexões

---

**Documentação criada por**: DevOps Team - Projeto Cirurgião  
**Última atualização**: Semana 2  
**Versão**: 1.0.0
