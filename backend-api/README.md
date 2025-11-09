# Backend API - Projeto Cirurgião

API RESTful desenvolvida com NestJS para o sistema de autenticação e gestão de usuários do Projeto Cirurgião.

## 🚀 Tecnologias

- **Node.js 20**
- **NestJS 10**
- **TypeScript 5**
- **Prisma 5** (ORM)
- **PostgreSQL** (Banco de dados)
- **JWT** (Autenticação)
- **Swagger** (Documentação)
- **Jest** (Testes)

## 📋 Pré-requisitos

- Node.js 20+
- PostgreSQL rodando em localhost:5432
- npm ou yarn

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npm run prisma:generate

# Executar migrations
npm run prisma:migrate
```

## ⚙️ Configuração

O arquivo `.env` já está configurado com:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/projeto_cirurgiao"
JWT_SECRET="projeto-cirurgiao-jwt-secret-key-2024"
JWT_EXPIRATION="15m"
JWT_REFRESH_SECRET="projeto-cirurgiao-refresh-secret-key-2024"
JWT_REFRESH_EXPIRATION="7d"
PORT=3000
NODE_ENV=development
```

## 🏃 Executando a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A API estará disponível em: `http://localhost:3000`

## 📚 Documentação Swagger

Acesse a documentação interativa em: `http://localhost:3000/api/docs`

## 🔐 Endpoints de Autenticação

### POST /api/v1/auth/register
Registrar novo usuário

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123",
  "name": "João Silva",
  "role": "STUDENT"
}
```

### POST /api/v1/auth/login
Fazer login

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "João Silva",
    "role": "STUDENT"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### POST /api/v1/auth/refresh
Renovar tokens

**Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

### POST /api/v1/auth/logout
Fazer logout (requer autenticação)

**Headers:**
```
Authorization: Bearer {accessToken}
```

### GET /api/v1/auth/me
Obter perfil do usuário autenticado

**Headers:**
```
Authorization: Bearer {accessToken}
```

## 👥 Endpoints de Usuários

Todos os endpoints de usuários requerem autenticação.

### GET /api/v1/users
Listar todos os usuários (ADMIN, INSTRUCTOR)

### GET /api/v1/users/:id
Buscar usuário por ID (ADMIN, INSTRUCTOR)

### PUT /api/v1/users/:id
Atualizar usuário (ADMIN)

**Body:**
```json
{
  "name": "Novo Nome",
  "email": "novoemail@example.com",
  "role": "INSTRUCTOR",
  "isActive": true
}
```

### DELETE /api/v1/users/:id
Remover usuário (ADMIN)

## 🎭 Roles (Permissões)

- **ADMIN**: Acesso total ao sistema
- **INSTRUCTOR**: Pode visualizar usuários
- **STUDENT**: Acesso básico

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com cobertura
npm run test:cov

# Testes e2e
npm run test:e2e
```

## 📦 Scripts Disponíveis

```bash
npm run build          # Compilar aplicação
npm run start          # Iniciar aplicação
npm run start:dev      # Iniciar em modo desenvolvimento
npm run start:prod     # Iniciar em modo produção
npm run lint           # Executar linter
npm run format         # Formatar código
npm run prisma:generate # Gerar Prisma Client
npm run prisma:migrate  # Executar migrations
npm run prisma:studio   # Abrir Prisma Studio
```

## 🏗️ Estrutura do Projeto

```
backend-api/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   ├── decorators/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   └── users/
│   │       ├── dto/
│   │       ├── users.controller.ts
│   │       ├── users.service.ts
│   │       └── users.module.ts
│   ├── shared/
│   │   ├── prisma/
│   │   └── enums/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── .env
├── package.json
└── tsconfig.json
```

## 🔒 Segurança

- Senhas são hasheadas com bcrypt (salt rounds: 10)
- JWT com tokens de acesso (15min) e refresh (7 dias)
- Refresh tokens são armazenados no banco e podem ser revogados
- Guards de autenticação e autorização (RBAC)
- Validação de dados com class-validator

## 📝 Padrões de Código

- **ESLint** e **Prettier** configurados
- Seguir padrões do NestJS
- DTOs para validação de entrada
- Tratamento de erros com exceções do NestJS
- Documentação Swagger em todos os endpoints

## 👨‍💻 Desenvolvido por

**Rafael - Backend Developer Sênior**  
Projeto Cirurgião - Semana 2

## 📄 Licença

Este projeto é privado e confidencial.
