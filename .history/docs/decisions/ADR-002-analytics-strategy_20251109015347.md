# ADR-002: Estratégia de Analytics

## Status
✅ **APROVADO** - 09/11/2025

## Contexto

O Projeto Cirurgião precisa de um sistema robusto de analytics para:
- Monitorar engajamento de vídeos (views, watch time, completion rate)
- Rastrear progresso dos alunos
- Medir eficácia de gamificação
- Analisar comportamento de usuários
- Gerar relatórios para administradores
- Otimizar conteúdo baseado em dados

### Requisitos Principais

1. **Analytics de Vídeo**
   - Views, watch time, buffering
   - Completion rate
   - Quality metrics (bitrate, resolution)
   - Geographic distribution

2. **Analytics de Negócio**
   - User engagement (DAU, MAU, retention)
   - Course completion rates
   - Gamification metrics (XP, achievements)
   - Revenue metrics (subscriptions, churn)

3. **Performance**
   - Real-time para dashboards
   - Queries rápidas (< 2s)
   - Suporte a agregações complexas

4. **Escalabilidade**
   - Milhões de eventos por dia
   - Retenção de dados (1-2 anos)
   - Custo otimizado

## Decisão

**Implementaremos uma estratégia híbrida:**
- **Cloudflare Stream Analytics** para métricas de vídeo
- **Google BigQuery** para analytics customizado de negócio
- **Redis** para métricas em tempo real

### Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    ANALYTICS PIPELINE                    │
└─────────────────────────────────────────────────────────┘

┌──────────────┐
│   Frontend   │
│   iOS/Android│
│   Web        │
└──────┬───────┘
       │
       │ Events
       ▼
┌──────────────────────────────────────┐
│         Backend API                  │
│  ┌────────────────────────────────┐  │
│  │   Event Processing Service     │  │
│  │   - Validation                 │  │
│  │   - Enrichment                 │  │
│  │   - Routing                    │  │
│  └────────────────────────────────┘  │
└──────┬───────────────────────────────┘
       │
       ├─────────────────┬──────────────────┐
       │                 │                  │
       ▼                 ▼                  ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Cloudflare │   │   BigQuery  │   │    Redis    │
│   Stream    │   │             │   │             │
│  Analytics  │   │  Data Lake  │   │  Real-time  │
│             │   │             │   │   Metrics   │
└─────────────┘   └─────────────┘   └─────────────┘
       │                 │                  │
       │                 │                  │
       └─────────────────┴──────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Admin Dashboard│
                │   - Reports     │
                │   - Charts      │
                │   - Exports     │
                └─────────────────┘
```

## Componente 1: Cloudflare Stream Analytics

### Responsabilidade
Métricas nativas de streaming de vídeo.

### Métricas Coletadas

```typescript
interface CloudflareVideoMetrics {
  // Visualizações
  views: number;
  uniqueViewers: number;
  
  // Tempo de visualização
  totalWatchTime: number; // segundos
  averageWatchTime: number;
  
  // Qualidade
  bufferingRate: number; // %
  startupTime: number; // ms
  bitrateDistribution: {
    '360p': number;
    '720p': number;
    '1080p': number;
  };
  
  // Geografia
  viewsByCountry: Record<string, number>;
  viewsByCity: Record<string, number>;
  
  // Dispositivos
  viewsByDevice: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}
```

### Integração

```typescript
// services/cloudflare-analytics.service.ts
export class CloudflareAnalyticsService {
  private readonly apiUrl = 'https://api.cloudflare.com/client/v4';
  private readonly accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  private readonly apiToken = process.env.CLOUDFLARE_API_TOKEN;

  async getVideoAnalytics(
    videoId: string,
    startDate: Date,
    endDate: Date
  ): Promise<CloudflareVideoMetrics> {
    const response = await fetch(
      `${this.apiUrl}/accounts/${this.accountId}/stream/analytics/views`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            SELECT
              count() as views,
              uniq(userId) as uniqueViewers,
              sum(watchTime) as totalWatchTime,
              avg(watchTime) as averageWatchTime,
              avg(bufferingRate) as bufferingRate
            FROM videoViews
            WHERE videoId = '${videoId}'
              AND timestamp >= '${startDate.toISOString()}'
              AND timestamp <= '${endDate.toISOString()}'
          `,
        }),
      }
    );

    return response.json();
  }

  async getAggregatedMetrics(): Promise<AggregatedMetrics> {
    // Métricas agregadas de todos os vídeos
    // Usado no dashboard principal
  }
}
```

### Vantagens
- ✅ Nativo do Cloudflare Stream (sem custo adicional)
- ✅ Métricas específicas de vídeo
- ✅ Dados em tempo real
- ✅ API simples e documentada

### Limitações
- ❌ Apenas métricas de vídeo
- ❌ Retenção limitada (90 dias)
- ❌ Queries limitadas

## Componente 2: Google BigQuery

### Responsabilidade
Analytics customizado de negócio e data warehouse.

### Schema de Dados

```sql
-- Tabela: user_events
CREATE TABLE cirurgiao_analytics.user_events (
  event_id STRING NOT NULL,
  user_id STRING NOT NULL,
  event_type STRING NOT NULL,
  event_timestamp TIMESTAMP NOT NULL,
  event_data JSON,
  session_id STRING,
  device_type STRING,
  platform STRING,
  app_version STRING,
  country STRING,
  city STRING
)
PARTITION BY DATE(event_timestamp)
CLUSTER BY user_id, event_type;

-- Tabela: video_progress
CREATE TABLE cirurgiao_analytics.video_progress (
  progress_id STRING NOT NULL,
  user_id STRING NOT NULL,
  video_id STRING NOT NULL,
  course_id STRING NOT NULL,
  watched_duration INT64,
  total_duration INT64,
  completion_percentage FLOAT64,
  timestamp TIMESTAMP NOT NULL
)
PARTITION BY DATE(timestamp)
CLUSTER BY user_id, video_id;

-- Tabela: gamification_events
CREATE TABLE cirurgiao_analytics.gamification_events (
  event_id STRING NOT NULL,
  user_id STRING NOT NULL,
  event_type STRING NOT NULL, -- xp_gained, level_up, achievement_unlocked
  xp_amount INT64,
  level INT64,
  achievement_id STRING,
  timestamp TIMESTAMP NOT NULL
)
PARTITION BY DATE(timestamp)
CLUSTER BY user_id, event_type;

-- Tabela: subscription_events
CREATE TABLE cirurgiao_analytics.subscription_events (
  event_id STRING NOT NULL,
  user_id STRING NOT NULL,
  event_type STRING NOT NULL, -- subscribed, canceled, renewed
  plan STRING,
  amount FLOAT64,
  currency STRING,
  timestamp TIMESTAMP NOT NULL
)
PARTITION BY DATE(timestamp)
CLUSTER BY user_id, event_type;
```

### Event Streaming

```typescript
// services/bigquery-analytics.service.ts
import { BigQuery } from '@google-cloud/bigquery';

export class BigQueryAnalyticsService {
  private bigquery: BigQuery;
  private dataset: string = 'cirurgiao_analytics';

  constructor() {
    this.bigquery = new BigQuery({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEY_FILE,
    });
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    const table = this.bigquery.dataset(this.dataset).table('user_events');
    
    await table.insert([{
      event_id: event.id,
      user_id: event.userId,
      event_type: event.type,
      event_timestamp: new Date().toISOString(),
      event_data: JSON.stringify(event.data),
      session_id: event.sessionId,
      device_type: event.deviceType,
      platform: event.platform,
      app_version: event.appVersion,
      country: event.country,
      city: event.city,
    }]);
  }

  async trackVideoProgress(progress: VideoProgress): Promise<void> {
    const table = this.bigquery.dataset(this.dataset).table('video_progress');
    
    await table.insert([{
      progress_id: progress.id,
      user_id: progress.userId,
      video_id: progress.videoId,
      course_id: progress.courseId,
      watched_duration: progress.watchedDuration,
      total_duration: progress.totalDuration,
      completion_percentage: progress.completionPercentage,
      timestamp: new Date().toISOString(),
    }]);
  }

  // Queries de Analytics
  async getUserEngagement(
    startDate: Date,
    endDate: Date
  ): Promise<EngagementMetrics> {
    const query = `
      SELECT
        COUNT(DISTINCT user_id) as dau,
        COUNT(DISTINCT CASE 
          WHEN event_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
          THEN user_id 
        END) as mau,
        AVG(session_duration) as avg_session_duration,
        COUNT(*) as total_events
      FROM \`${this.dataset}.user_events\`
      WHERE event_timestamp BETWEEN @startDate AND @endDate
    `;

    const [rows] = await this.bigquery.query({
      query,
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });

    return rows[0];
  }

  async getCourseCompletionRate(courseId: string): Promise<number> {
    const query = `
      WITH user_progress AS (
        SELECT
          user_id,
          AVG(completion_percentage) as avg_completion
        FROM \`${this.dataset}.video_progress\`
        WHERE course_id = @courseId
        GROUP BY user_id
      )
      SELECT
        AVG(CASE WHEN avg_completion >= 90 THEN 1 ELSE 0 END) as completion_rate
      FROM user_progress
    `;

    const [rows] = await this.bigquery.query({
      query,
      params: { courseId },
    });

    return rows[0].completion_rate;
  }

  async getRetentionCohort(
    cohortDate: Date
  ): Promise<RetentionMetrics[]> {
    const query = `
      WITH cohort AS (
        SELECT DISTINCT user_id
        FROM \`${this.dataset}.user_events\`
        WHERE DATE(event_timestamp) = @cohortDate
      ),
      retention AS (
        SELECT
          DATE_DIFF(DATE(e.event_timestamp), @cohortDate, DAY) as days_since_signup,
          COUNT(DISTINCT e.user_id) as active_users
        FROM \`${this.dataset}.user_events\` e
        INNER JOIN cohort c ON e.user_id = c.user_id
        WHERE DATE(e.event_timestamp) >= @cohortDate
        GROUP BY days_since_signup
      )
      SELECT
        days_since_signup,
        active_users,
        active_users / (SELECT COUNT(*) FROM cohort) as retention_rate
      FROM retention
      ORDER BY days_since_signup
    `;

    const [rows] = await this.bigquery.query({
      query,
      params: { cohortDate: cohortDate.toISOString().split('T')[0] },
    });

    return rows;
  }
}
```

### Vantagens
- ✅ Queries SQL complexas
- ✅ Escalabilidade massiva
- ✅ Custo otimizado (pay-per-query)
- ✅ Integração nativa com GCP
- ✅ Retenção longa de dados

### Custos Estimados

| Fase | Eventos/dia | Storage | Queries/dia | Custo/mês |
|------|-------------|---------|-------------|-----------|
| MVP | 10K | 1 GB | 100 | $5 |
| Beta | 100K | 10 GB | 500 | $30 |
| Launch | 1M | 100 GB | 2K | $150 |
| Scale | 10M | 1 TB | 10K | $800 |

## Componente 3: Redis (Real-time Metrics)

### Responsabilidade
Métricas em tempo real para dashboards.

### Métricas Armazenadas

```typescript
// Real-time counters
interface RealtimeMetrics {
  // Usuários online
  'online_users': Set<string>;
  
  // Vídeos sendo assistidos agora
  'watching_now:{videoId}': number;
  
  // Leaderboard (top 100)
  'leaderboard:global': SortedSet<{userId: string, xp: number}>;
  
  // Trending courses (últimas 24h)
  'trending:courses': SortedSet<{courseId: string, views: number}>;
  
  // Métricas agregadas (cache)
  'metrics:dau': number;
  'metrics:mau': number;
  'metrics:total_watch_time': number;
}
```

### Implementação

```typescript
// services/redis-analytics.service.ts
import Redis from 'ioredis';

export class RedisAnalyticsService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }

  // Usuários online
  async trackUserOnline(userId: string): Promise<void> {
    await this.redis.sadd('online_users', userId);
    await this.redis.expire('online_users', 300); // 5 minutos
  }

  async getOnlineUsersCount(): Promise<number> {
    return await this.redis.scard('online_users');
  }

  // Vídeos sendo assistidos
  async trackVideoWatching(videoId: string, userId: string): Promise<void> {
    const key = `watching_now:${videoId}`;
    await this.redis.sadd(key, userId);
    await this.redis.expire(key, 60); // 1 minuto
  }

  async getWatchingNow(videoId: string): Promise<number> {
    return await this.redis.scard(`watching_now:${videoId}`);
  }

  // Leaderboard
  async updateLeaderboard(userId: string, xp: number): Promise<void> {
    await this.redis.zadd('leaderboard:global', xp, userId);
  }

  async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const results = await this.redis.zrevrange(
      'leaderboard:global',
      0,
      limit - 1,
      'WITHSCORES'
    );

    const leaderboard: LeaderboardEntry[] = [];
    for (let i = 0; i < results.length; i += 2) {
      leaderboard.push({
        userId: results[i],
        xp: parseInt(results[i + 1]),
        rank: Math.floor(i / 2) + 1,
      });
    }

    return leaderboard;
  }

  // Trending courses
  async trackCourseView(courseId: string): Promise<void> {
    const key = 'trending:courses';
    await this.redis.zincrby(key, 1, courseId);
    await this.redis.expire(key, 86400); // 24 horas
  }

  async getTrendingCourses(limit: number = 10): Promise<string[]> {
    return await this.redis.zrevrange('trending:courses', 0, limit - 1);
  }

  // Cache de métricas agregadas
  async cacheMetric(key: string, value: any, ttl: number = 300): Promise<void> {
    await this.redis.setex(`metrics:${key}`, ttl, JSON.stringify(value));
  }

  async getCachedMetric<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(`metrics:${key}`);
    return value ? JSON.parse(value) : null;
  }
}
```

### Vantagens
- ✅ Latência ultra-baixa (< 1ms)
- ✅ Perfeito para real-time
- ✅ Leaderboards nativos (sorted sets)
- ✅ Cache de métricas agregadas

## Pipeline de Dados

### Fluxo de Eventos

```typescript
// controllers/analytics.controller.ts
export class AnalyticsController {
  constructor(
    private cloudflareService: CloudflareAnalyticsService,
    private bigqueryService: BigQueryAnalyticsService,
    private redisService: RedisAnalyticsService
  ) {}

  @Post('/track')
  async trackEvent(@Body() event: AnalyticsEvent): Promise<void> {
    // 1. Validar evento
    this.validateEvent(event);

    // 2. Enriquecer com metadata
    const enrichedEvent = await this.enrichEvent(event);

    // 3. Processar em paralelo
    await Promise.all([
      // BigQuery: Armazenamento permanente
      this.bigqueryService.trackEvent(enrichedEvent),
      
      // Redis: Métricas real-time
      this.updateRealtimeMetrics(enrichedEvent),
    ]);

    // 4. Cloudflare Stream Analytics é automático
    // (não precisa enviar eventos manualmente)
  }

  private async updateRealtimeMetrics(event: AnalyticsEvent): Promise<void> {
    switch (event.type) {
      case 'user_online':
        await this.redisService.trackUserOnline(event.userId);
        break;
      
      case 'video_watching':
        await this.redisService.trackVideoWatching(
          event.data.videoId,
          event.userId
        );
        break;
      
      case 'xp_gained':
        const userStats = await this.getUserStats(event.userId);
        await this.redisService.updateLeaderboard(
          event.userId,
          userStats.totalXp
        );
        break;
      
      case 'course_view':
        await this.redisService.trackCourseView(event.data.courseId);
        break;
    }
  }
}
```

## Dashboard de Analytics

### Métricas Principais

```typescript
// Endpoint: GET /api/v1/analytics/overview
