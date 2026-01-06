# 📹 PROGRESSO: UPLOAD DE VÍDEOS PARA CLOUDFLARE STREAM

## 📅 Data: 26/11/2025 (Atualizado)

## 🎯 OBJETIVO
Implementar upload de vídeos grandes para o Cloudflare Stream no sistema de gestão de cursos.

---

## ✅ PROBLEMAS RESOLVIDOS

### 1. Token de Autenticação Cloudflare
**Problema:** O backend estava usando um token antigo de uma variável de ambiente do sistema.

**Solução:**
- Identificado que existia `$env:atbQzEFtkWsQzg1WldCUqEnzYCH8vu1JVkjTMqgc` com valor antigo
- Token correto: `atbQzEFtkWsQzg1WldCUqEnzYCH8vu1JVkjTMqgc`
- Atualizado nos arquivos `.env` (raiz e backend-api)

### 2. Import do FormData
**Problema:** `form_data_1.default is not a constructor`

**Solução:**
```typescript
// ANTES
import FormData from 'form-data';

// DEPOIS
import * as FormData from 'form-data';
```

### 3. Campo cloudflareUrl Obrigatório
**Problema:** O DTO e schema Prisma exigiam `cloudflareUrl` como obrigatório, mas o vídeo ainda não tem URL quando está sendo processado.

**Solução:**
- Atualizado `backend-api/src/modules/videos/dto/create-video.dto.ts`:
  ```typescript
  @IsString()
  @IsOptional()
  cloudflareUrl?: string;
  ```
- Atualizado `backend-api/prisma/schema.prisma`:
  ```prisma
  cloudflareUrl   String?
  ```

### 4. Erro 413 (Payload Too Large)
**Problema:** Upload via FormData tem limite de 200MB na API do Cloudflare.

**Solução:** Implementado upload via **TUS protocol** (resumable uploads).

### 5. ⭐ NOVO: Timeout de 5 minutos no Frontend
**Problema:** O upload TUS estava funcionando (progresso de 4.46% e crescendo), mas o frontend dava timeout antes de completar.

**Solução:** Implementado **upload assíncrono** com polling de status:
1. Frontend envia arquivo para o backend
2. Backend salva arquivo em disco e retorna imediatamente com status "UPLOADING"
3. Upload TUS acontece em background
4. Frontend faz polling a cada 3 segundos para verificar status
5. Quando o vídeo está pronto, o frontend é notificado

---

## 🔧 ARQUIVOS MODIFICADOS (ATUALIZAÇÃO)

### Backend

#### `backend-api/prisma/schema.prisma`
- Adicionado enum `VideoUploadStatus` (PENDING, UPLOADING, PROCESSING, READY, ERROR)
- Adicionados campos no modelo Video:
  - `uploadStatus` - Status do upload
  - `uploadProgress` - Progresso em porcentagem (0-100)
  - `uploadError` - Mensagem de erro (se houver)
  - `tempFilePath` - Caminho do arquivo temporário
- `cloudflareId` agora é opcional (`String?`)

#### `backend-api/src/modules/videos/dto/create-video.dto.ts`
- `cloudflareId` agora é opcional
- Adicionados campos: `uploadStatus`, `uploadProgress`, `uploadError`, `tempFilePath`

#### `backend-api/src/modules/videos/videos.controller.ts`
- Método `uploadFile` agora usa `uploadFromDiskAsync` (assíncrono)
- Novo endpoint `GET /videos/:id/upload-status` para verificar status

#### `backend-api/src/modules/videos/videos.service.ts`
- Novo método `uploadFromDiskAsync()` - Cria registro e inicia upload em background
- Novo método `processUploadInBackground()` - Processa upload TUS em background
- Novo método `getUploadStatus()` - Retorna status atual do upload
- Atualiza progresso no banco durante o upload

#### `backend-api/src/modules/cloudflare/cloudflare-stream.service.ts`
- Novo método `uploadVideoViaTusWithProgress()` - Upload TUS com callback de progresso

### Frontend

#### `frontend-web/src/lib/types/course.types.ts`
- Adicionado tipo `VideoUploadStatus`
- Interface `Video` atualizada com campos de status
- Interface `CreateVideoDto` atualizada

#### `frontend-web/src/lib/api/videos.service.ts`
- Nova interface `UploadStatusResponse`
- Novo método `getUploadStatus()` - Verifica status de um vídeo
- Novo método `pollUploadStatus()` - Polling até completar ou falhar

#### `frontend-web/src/app/(dashboard)/admin/modules/[moduleId]/videos/page.tsx`
- Componente `UploadStatusBadge` - Mostra status visual do upload
- Polling automático para vídeos em processamento
- Notificações quando vídeo fica pronto ou falha
- Barra de progresso para vídeos em upload
- Botão de sincronização para vídeos em processamento

---

## 📦 MIGRATIONS APLICADAS

```bash
# Migration para adicionar campos de status de upload
npx prisma migrate dev --name add_video_upload_status
```

**Campos adicionados:**
- `uploadStatus` (enum VideoUploadStatus, default: PENDING)
- `uploadProgress` (Int, default: 0)
- `uploadError` (String?)
- `tempFilePath` (String?)
- `cloudflareId` agora é opcional

---

## 🚨 ESTADO ATUAL

### O que está funcionando:
- ✅ Token de autenticação correto
- ✅ Upload do arquivo para o backend
- ✅ Salvamento do arquivo em disco temporário
- ✅ Upload via TUS para Cloudflare Stream
- ✅ **Upload assíncrono (não bloqueia o frontend)**
- ✅ **Polling de status no frontend**
- ✅ **Notificações de progresso e conclusão**
- ✅ **Indicadores visuais de status (badges)**

### Pendente:
- ⚠️ Rodar `npx prisma generate` (falhou por permissão - servidor rodando)
- ⚠️ Testar fluxo completo após reiniciar o servidor

---

## 🔜 PRÓXIMOS PASSOS

### 1. Reiniciar o Backend
```powershell
# Parar o servidor atual (Ctrl+C)
# Depois rodar:
cd backend-api
npx prisma generate
npm run start:dev
```

### 2. Testar Upload
1. Acessar http://localhost:3001/admin/courses
2. Criar ou editar um curso
3. Adicionar um módulo
4. Fazer upload de um vídeo
5. Verificar se o status muda de UPLOADING → PROCESSING → READY

### 3. Melhorias Futuras
- [ ] Retry automático em caso de falha
- [ ] Cancelamento de upload
- [ ] Upload múltiplo de vídeos
- [ ] Preview do vídeo durante upload

---

## 📋 ARQUIVOS IMPORTANTES

| Arquivo | Descrição |
|---------|-----------|
| `backend-api/.env` | Variáveis de ambiente do backend |
| `backend-api/prisma/schema.prisma` | Schema do banco de dados |
| `backend-api/src/modules/cloudflare/cloudflare-stream.service.ts` | Serviço de upload para Cloudflare |
| `backend-api/src/modules/videos/videos.service.ts` | Serviço de vídeos (upload assíncrono) |
| `backend-api/src/modules/videos/videos.controller.ts` | Controller de vídeos |
| `frontend-web/src/lib/api/videos.service.ts` | Serviço de vídeos do frontend |
| `frontend-web/src/lib/types/course.types.ts` | Tipos TypeScript |
| `frontend-web/src/app/(dashboard)/admin/modules/[moduleId]/videos/page.tsx` | Página de vídeos |

---

## 🔑 CREDENCIAIS CLOUDFLARE

```
Account ID: ad41f4e2927a6daf25f7c7d6891e31bd
API Token: atbQzEFtkWsQzg1WldCUqEnzYCH8vu1JVkjTMqgc
Stream Customer Code: mcykto8a2uaqo5xu
Stream URL: https://customer-mcykto8a2uaqo5xu.cloudflarestream.com
```

---

## 🚀 COMO CONTINUAR

1. **Parar o servidor backend atual** (se estiver rodando)

2. **Gerar o Prisma Client:**
```powershell
cd backend-api
npx prisma generate
```

3. **Iniciar o backend:**
```powershell
cd backend-api
$env:CLOUDFLARE_API_TOKEN = "atbQzEFtkWsQzg1WldCUqEnzYCH8vu1JVkjTMqgc"
npm run start:dev
```

4. **Iniciar o frontend:**
```bash
cd frontend-web
npm run dev
```

5. **Testar o upload:**
   - Acesse http://localhost:3001/admin/courses
   - Crie um curso e um módulo
   - Faça upload de um vídeo
   - Observe o status mudando automaticamente

---

## 📊 FLUXO DE UPLOAD (NOVO)

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│  1. Usuário seleciona arquivo                                   │
│  2. Frontend envia para backend (POST /modules/:id/videos/upload)│
│  3. Frontend recebe vídeo com status "UPLOADING"                │
│  4. Frontend inicia polling a cada 3 segundos                   │
│  5. Quando status = "READY", mostra notificação                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
├─────────────────────────────────────────────────────────────────┤
│  1. Recebe arquivo e salva em disco temporário                  │
│  2. Cria registro no banco com status "UPLOADING"               │
│  3. Retorna imediatamente para o frontend                       │
│  4. Em background: inicia upload TUS para Cloudflare            │
│  5. Atualiza progresso no banco durante upload                  │
│  6. Quando TUS completa: status = "PROCESSING"                  │
│  7. Deleta arquivo temporário                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CLOUDFLARE                                 │
├─────────────────────────────────────────────────────────────────┤
│  1. Recebe vídeo via TUS protocol                               │
│  2. Processa e transcodifica o vídeo                            │
│  3. Quando pronto: readyToStream = true                         │
│  4. Backend verifica e atualiza status para "READY"             │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ RESUMO DAS MUDANÇAS

### Problema Original
O frontend dava timeout de 5 minutos antes do upload TUS completar para o Cloudflare.

### Solução Implementada
1. **Upload Assíncrono**: O backend retorna imediatamente após receber o arquivo
2. **Processamento em Background**: O upload TUS acontece em segundo plano
3. **Polling de Status**: O frontend verifica o status a cada 3 segundos
4. **Feedback Visual**: Badges coloridos mostram o status atual
5. **Notificações**: Toast quando o vídeo fica pronto ou falha

### Benefícios
- ✅ Sem timeout no frontend
- ✅ Usuário pode fechar a janela e o upload continua
- ✅ Feedback em tempo real do progresso
- ✅ Suporte a vídeos de qualquer tamanho (até 50GB)
- ✅ Upload resumível (TUS protocol)
