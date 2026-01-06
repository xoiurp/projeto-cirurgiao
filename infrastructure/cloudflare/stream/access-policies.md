# Cloudflare Stream - Políticas de Acesso

## 📋 Visão Geral

Este documento define as políticas de acesso e segurança para vídeos no Cloudflare Stream, garantindo que apenas usuários autorizados possam visualizar o conteúdo.

## 🎯 Objetivo

Implementar controle de acesso robusto para proteger o conteúdo educacional e garantir que apenas usuários pagantes/autorizados possam assistir aos vídeos.

## 🔒 Níveis de Acesso

### 1. Público (Free)
- Vídeos de demonstração
- Trailers de cursos
- Conteúdo promocional

### 2. Autenticado (Registered)
- Usuários logados
- Acesso a vídeos gratuitos
- Preview de cursos pagos

### 3. Premium (Paid)
- Usuários com assinatura ativa
- Acesso completo aos cursos
- Download offline (mobile)

### 4. Admin
- Instrutores
- Administradores
- Acesso total

## 🛡️ Estratégias de Segurança

### 1. Signed URLs

Todos os vídeos usam signed URLs com expiração:

```typescript
// backend-api/src/modules/videos/videos.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { CloudflareStreamService } from '@/modules/cloudflare/cloudflare-stream.service';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class VideosService {
  constructor(
    private readonly cloudflare: CloudflareStreamService,
    private readonly prisma: PrismaService,
  ) {}

  async getStreamUrl(
    videoId: string,
    userId: string,
  ): Promise<{ url: string; expiresAt: Date }> {
    // 1. Buscar vídeo
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
      include: {
        course: {
          include: {
            enrollments: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!video) {
      throw new NotFoundException('Vídeo não encontrado');
    }

    // 2. Verificar permissões
    await this.checkAccess(video, userId);

    // 3. Gerar signed URL
    const expiresIn = 3600; // 1 hora
    const token = await this.cloudflare.getSignedStreamUrl(
      video.cloudflareId,
      expiresIn,
    );

    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // 4. Registrar acesso
    await this.prisma.videoView.create({
      data: {
        videoId,
        userId,
        startedAt: new Date(),
      },
    });

    return {
      url: `https://customer-mcykto8a2uaqo5xu.cloudflarestream.com/${video.cloudflareId}/manifest/video.m3u8?token=${token}`,
      expiresAt,
    };
  }

  private async checkAccess(video: any, userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    // Admin sempre tem acesso
    if (user.role === 'ADMIN' || user.role === 'INSTRUCTOR') {
      return;
    }

    // Vídeo público
    if (video.isPublic) {
      return;
    }

    // Verificar matrícula no curso
    const enrollment = video.course.enrollments[0];
    if (!enrollment) {
      throw new ForbiddenException('Você não está matriculado neste curso');
    }

    // Verificar se matrícula está ativa
    if (enrollment.status !== 'ACTIVE') {
      throw new ForbiddenException('Sua matrícula não está ativa');
    }

    // Verificar assinatura (se necessário)
    if (video.course.requiresSubscription) {
      if (!user.subscription || user.subscription.status !== 'ACTIVE') {
        throw new ForbiddenException('Assinatura premium necessária');
      }
    }
  }
}
```

### 2. Token Refresh

Implementar renovação automática de tokens no player:

```typescript
// frontend-web/src/components/video-player.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Stream } from '@cloudflare/stream-react';

export function VideoPlayer({ videoId }: { videoId: string }) {
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadStreamUrl();
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [videoId]);

  const loadStreamUrl = async () => {
    try {
      const response = await fetch(`/api/v1/videos/${videoId}/stream-url`);
      const data = await response.json();

      setStreamUrl(data.url);
      setExpiresAt(new Date(data.expiresAt));

      // Renovar 5 minutos antes de expirar
      const expiresIn = new Date(data.expiresAt).getTime() - Date.now();
      const refreshIn = expiresIn - 5 * 60 * 1000; // 5 minutos antes

      if (refreshIn > 0) {
        refreshTimerRef.current = setTimeout(() => {
          loadStreamUrl();
        }, refreshIn);
      }
    } catch (error) {
      console.error('Error loading stream URL:', error);
    }
  };

  if (!streamUrl) {
    return <div>Carregando vídeo...</div>;
  }

  return <Stream src={streamUrl} controls responsive />;
}
```

### 3. Restrições Geográficas

Limitar acesso por país (opcional):

```typescript
async getSignedStreamUrl(
  videoId: string,
  expiresIn: number = 3600,
  allowedCountries: string[] = ['BR'], // Apenas Brasil
): Promise<string> {
  const response = await fetch(
    `${this.apiUrl}/accounts/${this.accountId}/stream/${videoId}/token`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + expiresIn,
        accessRules: [
          {
            type: 'ip.geoip.country',
            action: 'allow',
            country: allowedCountries,
          },
        ],
      }),
    }
  );

  const data = await response.json();
  return data.result.token;
}
```

### 4. Limite de Dispositivos

Controlar número de dispositivos simultâneos:

```typescript
async getStreamUrl(
  videoId: string,
  userId: string,
  deviceId: string,
): Promise<{ url: string; expiresAt: Date }> {
  // Verificar dispositivos ativos
  const activeDevices = await this.prisma.activeDevice.count({
    where: {
      userId,
      lastSeenAt: {
        gte: new Date(Date.now() - 5 * 60 * 1000), // Últimos 5 minutos
      },
    },
  });

  const maxDevices = 3; // Máximo 3 dispositivos simultâneos

  if (activeDevices >= maxDevices) {
    throw new ForbiddenException(
      `Limite de ${maxDevices} dispositivos simultâneos atingido`,
    );
  }

  // Registrar dispositivo
  await this.prisma.activeDevice.upsert({
    where: {
      userId_deviceId: {
        userId,
        deviceId,
      },
    },
    create: {
      userId,
      deviceId,
      lastSeenAt: new Date(),
    },
    update: {
      lastSeenAt: new Date(),
    },
  });

  // Gerar URL...
  return this.getStreamUrl(videoId, userId);
}
```

### 5. Watermark Dinâmico

Adicionar watermark com informações do usuário:

```typescript
async getStreamUrlWithWatermark(
  videoId: string,
  userId: string,
): Promise<string> {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  // Criar watermark temporário com email do usuário
  const watermarkText = `${user.email} - ${new Date().toISOString()}`;
  
  // Nota: Cloudflare Stream não suporta watermarks dinâmicos via API
  // Alternativa: Adicionar overlay no player com JavaScript
  
  return this.getStreamUrl(videoId, userId);
}
```

## 📊 Monitoramento de Acesso

### 1. Logs de Acesso

```typescript
// Registrar todos os acessos
await this.prisma.videoAccessLog.create({
  data: {
    videoId,
    userId,
    deviceId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    country: req.headers['cf-ipcountry'], // Cloudflare header
    accessedAt: new Date(),
  },
});
```

### 2. Detecção de Compartilhamento

```typescript
async detectSharing(userId: string): Promise<boolean> {
  // Verificar acessos nas últimas 24h
  const recentAccesses = await this.prisma.videoAccessLog.findMany({
    where: {
      userId,
      accessedAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    select: {
      ipAddress: true,
      country: true,
    },
  });

  // Contar IPs únicos
  const uniqueIPs = new Set(recentAccesses.map(a => a.ipAddress));
  
  // Contar países únicos
  const uniqueCountries = new Set(recentAccesses.map(a => a.country));

  // Suspeito se mais de 5 IPs ou 2 países diferentes
  const isSuspicious = uniqueIPs.size > 5 || uniqueCountries.size > 2;

  if (isSuspicious) {
    // Notificar admin
    await this.notificationService.notifyAdmin({
      type: 'SUSPICIOUS_ACTIVITY',
      userId,
      details: {
        uniqueIPs: uniqueIPs.size,
        uniqueCountries: uniqueCountries.size,
      },
    });
  }

  return isSuspicious;
}
```

### 3. Rate Limiting

```typescript
import { ThrottlerGuard } from '@nestjs/throttler';
import { UseGuards } from '@nestjs/common';

@Controller('videos')
@UseGuards(ThrottlerGuard)
export class VideosController {
  // Limite: 10 requisições por minuto por usuário
  @Get(':id/stream-url')
  @Throttle(10, 60)
  async getStreamUrl(
    @Param('id') videoId: string,
    @GetUser() user: User,
  ) {
    return this.videosService.getStreamUrl(videoId, user.id);
  }
}
```

## 🔐 Políticas por Tipo de Conteúdo

### Vídeos Públicos (Demo/Trailer)

```typescript
{
  requireSignedURLs: false,
  allowedOrigins: ['*'],
  downloadable: false,
  requireAuth: false
}
```

### Vídeos de Curso Gratuito

```typescript
{
  requireSignedURLs: true,
  allowedOrigins: ['https://cirurgiao.com'],
  downloadable: false,
  requireAuth: true,
  tokenExpiration: 3600 // 1 hora
}
```

### Vídeos de Curso Premium

```typescript
{
  requireSignedURLs: true,
  allowedOrigins: ['https://cirurgiao.com'],
  downloadable: true, // Apenas mobile
  requireAuth: true,
  requireSubscription: true,
  tokenExpiration: 3600,
  maxDevices: 3,
  geoRestrictions: ['BR']
}
```

### Vídeos Administrativos

```typescript
{
  requireSignedURLs: true,
  allowedOrigins: ['https://admin.cirurgiao.com'],
  downloadable: true,
  requireAuth: true,
  requireRole: ['ADMIN', 'INSTRUCTOR'],
  tokenExpiration: 7200 // 2 horas
}
```

## 🚨 Resposta a Violações

### 1. Detecção de Violação

```typescript
async handleViolation(
  userId: string,
  violationType: 'SHARING' | 'DOWNLOAD_ABUSE' | 'GEO_VIOLATION',
): Promise<void> {
  // Registrar violação
  await this.prisma.securityViolation.create({
    data: {
      userId,
      type: violationType,
      detectedAt: new Date(),
    },
  });

  // Contar violações
  const violationCount = await this.prisma.securityViolation.count({
    where: {
      userId,
      detectedAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias
      },
    },
  });

  // Ações progressivas
  if (violationCount === 1) {
    // Primeira violação: Aviso
    await this.notificationService.send({
      userId,
      type: 'SECURITY_WARNING',
      title: 'Atividade Suspeita Detectada',
      message: 'Detectamos atividade suspeita em sua conta. Por favor, revise nossos termos de uso.',
    });
  } else if (violationCount === 2) {
    // Segunda violação: Suspensão temporária
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        suspendedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      },
    });
  } else if (violationCount >= 3) {
    // Terceira violação: Banimento
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'BANNED',
        bannedAt: new Date(),
      },
    });
  }
}
```

## 📱 Políticas Mobile

### Download Offline

```typescript
async getDownloadUrl(
  videoId: string,
  userId: string,
  deviceId: string,
): Promise<string> {
  // Verificar se usuário tem permissão
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user.subscription || user.subscription.status !== 'ACTIVE') {
    throw new ForbiddenException('Download offline apenas para assinantes premium');
  }

  // Verificar limite de downloads
  const downloadCount = await this.prisma.offlineDownload.count({
    where: {
      userId,
      deviceId,
      expiresAt: {
        gte: new Date(),
      },
    },
  });

  const maxDownloads = 10; // Máximo 10 vídeos offline por dispositivo

  if (downloadCount >= maxDownloads) {
    throw new ForbiddenException(
      `Limite de ${maxDownloads} downloads offline atingido`,
    );
  }

  // Gerar URL de download com expiração longa
  const token = await this.cloudflare.getSignedStreamUrl(
    videoId,
    7 * 24 * 60 * 60, // 7 dias
  );

  // Registrar download
  await this.prisma.offlineDownload.create({
    data: {
      videoId,
      userId,
      deviceId,
      downloadedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return token;
}
```

## 🧪 Testes de Segurança

### 1. Teste de Acesso Não Autorizado

```typescript
describe('Video Access Control', () => {
  it('should deny access to non-enrolled users', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/videos/video-id/stream-url')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);

    expect(response.body.message).toContain('não está matriculado');
  });

  it('should deny access with expired subscription', async () => {
    // Expirar assinatura
    await prisma.subscription.update({
      where: { userId: user.id },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    await request(app.getHttpServer())
      .get('/api/v1/videos/video-id/stream-url')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});
```

### 2. Teste de Token Expirado

```typescript
it('should reject expired tokens', async () => {
  const expiredToken = await cloudflare.getSignedStreamUrl(
    'video-id',
    -3600, // Expirado há 1 hora
  );

  // Tentar acessar com token expirado
  const response = await fetch(
    `https://customer-mcykto8a2uaqo5xu.cloudflarestream.com/video-id/manifest/video.m3u8?token=${expiredToken}`
  );

  expect(response.status).toBe(403);
});
```

## 📚 Referências

- [Cloudflare Stream Security](https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/)
- [Signed URLs](https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/#signed-urls)
- [Access Rules](https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/#access-rules)

---

**Última Atualização**: 09/11/2025  
**Responsável**: Carolina (DevOps Engineer)  
**Status**: ✅ Configurado
