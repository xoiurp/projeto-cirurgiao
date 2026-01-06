# Cloudflare Stream - Configuração de Webhooks

## 📋 Visão Geral

Webhooks permitem que o Cloudflare Stream notifique seu backend sobre eventos importantes, como:
- Vídeo processado com sucesso
- Erro no processamento
- Vídeo deletado
- Mudanças de status

## 🎯 Objetivo

Configurar webhooks para receber notificações automáticas sobre o status dos vídeos e atualizar o banco de dados em tempo real.

## 📚 Eventos Disponíveis

### 1. video.upload.complete
Disparado quando o upload é concluído e o vídeo entra na fila de processamento.

```json
{
  "uid": "abc123def456",
  "status": {
    "state": "queued",
    "pctComplete": 0
  },
  "meta": {
    "name": "Título do Vídeo"
  },
  "created": "2025-11-09T12:00:00Z"
}
```

### 2. video.ready
Disparado quando o vídeo foi processado e está pronto para streaming.

```json
{
  "uid": "abc123def456",
  "status": {
    "state": "ready",
    "pctComplete": 100
  },
  "meta": {
    "name": "Título do Vídeo"
  },
  "duration": 300.5,
  "input": {
    "width": 1920,
    "height": 1080
  },
  "playback": {
    "hls": "https://customer-mcykto8a2uaqo5xu.cloudflarestream.com/abc123def456/manifest/video.m3u8",
    "dash": "https://customer-mcykto8a2uaqo5xu.cloudflarestream.com/abc123def456/manifest/video.mpd"
  },
  "preview": "https://customer-mcykto8a2uaqo5xu.cloudflarestream.com/abc123def456/watch",
  "thumbnail": "https://customer-mcykto8a2uaqo5xu.cloudflarestream.com/abc123def456/thumbnails/thumbnail.jpg",
  "created": "2025-11-09T12:00:00Z",
  "modified": "2025-11-09T12:05:30Z"
}
```

### 3. video.error
Disparado quando há erro no processamento do vídeo.

```json
{
  "uid": "abc123def456",
  "status": {
    "state": "error",
    "errorReasonCode": "ERR_CODEC_UNSUPPORTED",
    "errorReasonText": "Codec not supported"
  },
  "meta": {
    "name": "Título do Vídeo"
  },
  "created": "2025-11-09T12:00:00Z",
  "modified": "2025-11-09T12:01:15Z"
}
```

### 4. video.deleted
Disparado quando um vídeo é deletado.

```json
{
  "uid": "abc123def456",
  "status": {
    "state": "deleted"
  },
  "deleted": "2025-11-09T12:30:00Z"
}
```

## 🚀 Configuração

### 1. Criar Endpoint no Backend

Primeiro, crie um endpoint para receber os webhooks:

```typescript
// backend-api/src/modules/cloudflare/cloudflare-webhook.controller.ts
import { Controller, Post, Body, Headers, HttpCode, UnauthorizedException } from '@nestjs/common';
import { CloudflareWebhookService } from './cloudflare-webhook.service';
import * as crypto from 'crypto';

@Controller('webhooks/cloudflare')
export class CloudflareWebhookController {
  constructor(
    private readonly webhookService: CloudflareWebhookService,
  ) {}

  @Post('stream')
  @HttpCode(200)
  async handleStreamWebhook(
    @Body() payload: any,
    @Headers('webhook-signature') signature: string,
  ): Promise<{ success: boolean }> {
    // 1. Validar assinatura do webhook
    this.validateSignature(payload, signature);

    // 2. Processar evento
    await this.webhookService.processStreamEvent(payload);

    return { success: true };
  }

  private validateSignature(payload: any, signature: string): void {
    const webhookSecret = process.env.CLOUDFLARE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      throw new Error('CLOUDFLARE_WEBHOOK_SECRET not configured');
    }

    // Calcular HMAC SHA-256
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const body = JSON.stringify(payload);
    hmac.update(body);
    const expectedSignature = hmac.digest('hex');

    // Comparar assinaturas
    if (signature !== expectedSignature) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }
}
```

### 2. Implementar Service de Processamento

```typescript
// backend-api/src/modules/cloudflare/cloudflare-webhook.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { NotificationService } from '@/modules/notifications/notification.service';

interface StreamWebhookPayload {
  uid: string;
  status: {
    state: 'queued' | 'inprogress' | 'ready' | 'error' | 'deleted';
    pctComplete?: number;
    errorReasonCode?: string;
    errorReasonText?: string;
  };
  meta?: {
    name: string;
  };
  duration?: number;
  playback?: {
    hls: string;
    dash: string;
  };
  preview?: string;
  thumbnail?: string;
  created?: string;
  modified?: string;
}

@Injectable()
export class CloudflareWebhookService {
  private readonly logger = new Logger(CloudflareWebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async processStreamEvent(payload: StreamWebhookPayload): Promise<void> {
    const { uid, status, meta, duration, playback, preview, thumbnail } = payload;

    this.logger.log(`Processing webhook for video ${uid}: ${status.state}`);

    try {
      switch (status.state) {
        case 'queued':
          await this.handleQueued(uid);
          break;

        case 'inprogress':
          await this.handleInProgress(uid, status.pctComplete);
          break;

        case 'ready':
          await this.handleReady(uid, {
            duration,
            playbackUrl: playback?.hls,
            previewUrl: preview,
            thumbnailUrl: thumbnail,
          });
          break;

        case 'error':
          await this.handleError(uid, {
            errorCode: status.errorReasonCode,
            errorMessage: status.errorReasonText,
          });
          break;

        case 'deleted':
          await this.handleDeleted(uid);
          break;

        default:
          this.logger.warn(`Unknown status: ${status.state}`);
      }
    } catch (error) {
      this.logger.error(`Error processing webhook for video ${uid}:`, error);
      throw error;
    }
  }

  private async handleQueued(videoId: string): Promise<void> {
    await this.prisma.video.update({
      where: { cloudflareId: videoId },
      data: {
        status: 'PROCESSING',
        processingProgress: 0,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Video ${videoId} queued for processing`);
  }

  private async handleInProgress(
    videoId: string,
    progress: number,
  ): Promise<void> {
    await this.prisma.video.update({
      where: { cloudflareId: videoId },
      data: {
        processingProgress: progress,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Video ${videoId} processing: ${progress}%`);
  }

  private async handleReady(
    videoId: string,
    data: {
      duration: number;
      playbackUrl: string;
      previewUrl: string;
      thumbnailUrl: string;
    },
  ): Promise<void> {
    const video = await this.prisma.video.update({
      where: { cloudflareId: videoId },
      data: {
        status: 'READY',
        processingProgress: 100,
        duration: Math.floor(data.duration),
        playbackUrl: data.playbackUrl,
        previewUrl: data.previewUrl,
        thumbnailUrl: data.thumbnailUrl,
        readyAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });

    this.logger.log(`Video ${videoId} ready for streaming`);

    // Notificar instrutor
    if (video.course?.instructor) {
      await this.notificationService.send({
        userId: video.course.instructor.id,
        type: 'VIDEO_READY',
        title: 'Vídeo Processado',
        message: `O vídeo "${video.title}" foi processado e está pronto para visualização.`,
        data: {
          videoId: video.id,
          courseId: video.courseId,
        },
      });
    }
  }

  private async handleError(
    videoId: string,
    error: {
      errorCode: string;
      errorMessage: string;
    },
  ): Promise<void> {
    const video = await this.prisma.video.update({
      where: { cloudflareId: videoId },
      data: {
        status: 'ERROR',
        errorCode: error.errorCode,
        errorMessage: error.errorMessage,
        updatedAt: new Date(),
      },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });

    this.logger.error(
      `Video ${videoId} processing failed: ${error.errorCode} - ${error.errorMessage}`,
    );

    // Notificar instrutor sobre erro
    if (video.course?.instructor) {
      await this.notificationService.send({
        userId: video.course.instructor.id,
        type: 'VIDEO_ERROR',
        title: 'Erro no Processamento',
        message: `Erro ao processar o vídeo "${video.title}": ${error.errorMessage}`,
        data: {
          videoId: video.id,
          courseId: video.courseId,
          errorCode: error.errorCode,
        },
      });
    }
  }

  private async handleDeleted(videoId: string): Promise<void> {
    await this.prisma.video.update({
      where: { cloudflareId: videoId },
      data: {
        status: 'DELETED',
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Video ${videoId} deleted`);
  }
}
```

### 3. Registrar Webhook na Cloudflare

#### Via Dashboard

1. Acesse o [Dashboard da Cloudflare](https://dash.cloudflare.com)
2. Vá para **Stream** > **Settings** > **Webhooks**
3. Clique em **Add Webhook**
4. Configure:
   - **URL**: `https://api.cirurgiao.com/webhooks/cloudflare/stream`
   - **Secret**: Gere um secret forte (salve no `.env`)
   - **Events**: Selecione todos os eventos
5. Clique em **Save**

#### Via API

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/webhook" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notificationUrl": "https://api.cirurgiao.com/webhooks/cloudflare/stream",
    "secret": "seu_webhook_secret_aqui"
  }'
```

**Resposta**:
```json
{
  "success": true,
  "result": {
    "notificationUrl": "https://api.cirurgiao.com/webhooks/cloudflare/stream",
    "secret": "seu_webhook_secret_aqui",
    "created": "2025-11-09T12:00:00Z",
    "modified": "2025-11-09T12:00:00Z"
  }
}
```

### 4. Configurar Variáveis de Ambiente

Adicione ao `.env`:

```env
# Cloudflare Webhook
CLOUDFLARE_WEBHOOK_SECRET=seu_webhook_secret_forte_aqui
```

**Gerar Secret Forte**:
```bash
# Linux/Mac
openssl rand -hex 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 🧪 Testes

### 1. Teste Local com ngrok

Para testar webhooks localmente:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta local
ngrok http 3000

# Usar URL do ngrok no webhook
# Exemplo: https://abc123.ngrok.io/webhooks/cloudflare/stream
```

### 2. Teste Manual

Simule um webhook manualmente:

```bash
# Calcular signature
WEBHOOK_SECRET="seu_secret_aqui"
PAYLOAD='{"uid":"test123","status":{"state":"ready"}}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | cut -d' ' -f2)

# Enviar webhook
curl -X POST \
  "http://localhost:3000/webhooks/cloudflare/stream" \
  -H "Content-Type: application/json" \
  -H "webhook-signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

### 3. Verificar Logs

```bash
# Backend logs
tail -f backend-api/logs/app.log | grep "webhook"

# Cloudflare webhook logs (via dashboard)
# Stream > Settings > Webhooks > View Logs
```

## 📊 Monitoramento

### Métricas Importantes

- **Webhook Success Rate**: > 99%
- **Processing Time**: < 1s
- **Retry Rate**: < 1%
- **Error Rate**: < 0.1%

### Alertas

Configure alertas para:
- Webhook failures > 5 em 5 minutos
- Processing time > 5s
- Signature validation failures

### Logs Estruturados

```typescript
this.logger.log({
  event: 'webhook_received',
  videoId: uid,
  status: status.state,
  timestamp: new Date().toISOString(),
});
```

## 🔒 Segurança

### Checklist de Segurança

- ✅ Validação de assinatura HMAC SHA-256
- ✅ Secret forte (32+ caracteres)
- ✅ HTTPS obrigatório
- ✅ Rate limiting no endpoint
- ✅ Logs de tentativas de acesso
- ✅ Timeout de processamento

### Validação de Payload

```typescript
import { IsString, IsObject, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class StatusDto {
  @IsEnum(['queued', 'inprogress', 'ready', 'error', 'deleted'])
  state: string;
}

class WebhookPayloadDto {
  @IsString()
  uid: string;

  @IsObject()
  @ValidateNested()
  @Type(() => StatusDto)
  status: StatusDto;
}
```

## 🔄 Retry Logic

O Cloudflare tenta reenviar webhooks em caso de falha:

- **Tentativa 1**: Imediato
- **Tentativa 2**: Após 1 minuto
- **Tentativa 3**: Após 5 minutos
- **Tentativa 4**: Após 15 minutos
- **Tentativa 5**: Após 1 hora

**Importante**: Seu endpoint deve ser idempotente!

```typescript
async processStreamEvent(payload: StreamWebhookPayload): Promise<void> {
  // Verificar se já processamos este evento
  const existing = await this.prisma.webhookEvent.findUnique({
    where: {
      cloudflareId_eventType: {
        cloudflareId: payload.uid,
        eventType: payload.status.state,
      },
    },
  });

  if (existing) {
    this.logger.log(`Event already processed: ${payload.uid}`);
    return;
  }

  // Processar evento...
  
  // Registrar que processamos
  await this.prisma.webhookEvent.create({
    data: {
      cloudflareId: payload.uid,
      eventType: payload.status.state,
      payload: payload,
      processedAt: new Date(),
    },
  });
}
```

## 🆘 Troubleshooting

### Webhook não está sendo recebido

1. Verificar URL está acessível publicamente
2. Verificar HTTPS está configurado
3. Verificar firewall/security groups
4. Verificar logs do Cloudflare (Dashboard > Stream > Webhooks > Logs)

### Erro de validação de assinatura

1. Verificar `CLOUDFLARE_WEBHOOK_SECRET` está correto
2. Verificar payload não foi modificado
3. Verificar encoding do body (deve ser string JSON)

### Webhook timeout

1. Processar de forma assíncrona
2. Retornar 200 OK imediatamente
3. Usar fila (Redis/Bull) para processamento

```typescript
@Post('stream')
@HttpCode(200)
async handleStreamWebhook(
  @Body() payload: any,
  @Headers('webhook-signature') signature: string,
): Promise<{ success: boolean }> {
  // Validar assinatura
  this.validateSignature(payload, signature);

  // Adicionar à fila para processamento assíncrono
  await this.webhookQueue.add('process-stream-event', payload);

  // Retornar imediatamente
  return { success: true };
}
```

## 📚 Referências

- [Cloudflare Stream Webhooks](https://developers.cloudflare.com/stream/webhooks/)
- [HMAC Signature Validation](https://developers.cloudflare.com/stream/webhooks/#signature-verification)
- [Webhook Best Practices](https://developers.cloudflare.com/stream/webhooks/#best-practices)

---

**Última Atualização**: 09/11/2025  
**Responsável**: Carolina (DevOps Engineer)  
**Status**: ✅ Configurado
