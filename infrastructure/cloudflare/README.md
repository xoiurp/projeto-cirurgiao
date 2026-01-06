# Cloudflare Stream & R2 - Documentação Completa

## 📋 Visão Geral

Documentação completa da configuração e uso do Cloudflare Stream e R2 para o Projeto Cirurgião.

## 🎯 Objetivo

Fornecer hospedagem, transcodificação e entrega de vídeos educacionais com alta performance, baixa latência e custos otimizados.

## 📚 Estrutura da Documentação

```
infrastructure/cloudflare/
├── stream/                      # Cloudflare Stream
│   ├── stream-setup.md         # Configuração inicial
│   ├── webhook-config.md       # Webhooks e notificações
│   └── access-policies.md      # Políticas de acesso e segurança
├── r2/                         # Cloudflare R2
│   ├── bucket-config.md        # Configuração do bucket
│   ├── cors-config.md          # CORS e uploads diretos
│   └── access-policy.md        # Políticas de acesso (a criar)
├── cdn/                        # CDN Configuration (a criar)
│   ├── cdn-config.md
│   └── cache-policies.md
└── docs/                       # Documentação geral
    ├── setup-guide.md          # Guia de setup (este arquivo)
    ├── troubleshooting.md      # Solução de problemas
    └── cost-estimation.md      # Estimativa de custos
```

## 🚀 Quick Start

### 1. Pré-requisitos

- Conta Cloudflare ativa
- Account ID: `ad41f4e2927a6daf25f7c7d6891e31bd`
- API Token configurado
- AWS CLI instalado (para R2)

### 2. Configuração Inicial

#### Cloudflare Stream

```bash
# 1. Habilitar Stream no dashboard
# https://dash.cloudflare.com/ad41f4e2927a6daf25f7c7d6891e31bd/stream

# 2. Configurar variáveis de ambiente
cat >> .env << EOF
CLOUDFLARE_API_TOKEN=seu_token_aqui
CLOUDFLARE_ACCOUNT_ID=ad41f4e2927a6daf25f7c7d6891e31bd
CLOUDFLARE_STREAM_CUSTOMER_CODE=mcykto8a2uaqo5xu
CLOUDFLARE_WEBHOOK_SECRET=seu_webhook_secret_aqui
EOF

# 3. Testar conexão
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

#### Cloudflare R2

```bash
# 1. Criar bucket
aws s3 mb s3://s3-projeto-cirurgiao \
  --endpoint-url https://ad41f4e2927a6daf25f7c7d6891e31bd.r2.cloudflarestorage.com \
  --profile cloudflare-r2

# 2. Configurar CORS
aws s3api put-bucket-cors \
  --bucket s3-projeto-cirurgiao \
  --cors-configuration file://cors-config.json \
  --endpoint-url https://ad41f4e2927a6daf25f7c7d6891e31bd.r2.cloudflarestorage.com \
  --profile cloudflare-r2

# 3. Adicionar ao .env
cat >> .env << EOF
R2_ACCOUNT_ID=ad41f4e2927a6daf25f7c7d6891e31bd
R2_ACCESS_KEY_ID=seu_access_key_id
R2_SECRET_ACCESS_KEY=seu_secret_access_key
R2_BUCKET_NAME=s3-projeto-cirurgiao
R2_ENDPOINT=https://ad41f4e2927a6daf25f7c7d6891e31bd.r2.cloudflarestorage.com
EOF
```

### 3. Instalação de Dependências

```bash
# Backend
cd backend-api
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# Frontend (opcional)
cd frontend-web
npm install @cloudflare/stream-react
```

## 📖 Guias Detalhados

### Cloudflare Stream

| Documento | Descrição |
|-----------|-----------|
| [stream-setup.md](stream/stream-setup.md) | Configuração completa do Stream, upload de vídeos, signed URLs |
| [webhook-config.md](stream/webhook-config.md) | Configuração de webhooks para notificações de processamento |
| [access-policies.md](stream/access-policies.md) | Políticas de acesso, segurança e controle de usuários |

### Cloudflare R2

| Documento | Descrição |
|-----------|-----------|
| [bucket-config.md](r2/bucket-config.md) | Criação e configuração do bucket, estrutura de diretórios |
| [cors-config.md](r2/cors-config.md) | Configuração CORS para uploads diretos do frontend |

### Documentação Geral

| Documento | Descrição |
|-----------|-----------|
| [troubleshooting.md](docs/troubleshooting.md) | Solução de problemas comuns |
| [cost-estimation.md](docs/cost-estimation.md) | Estimativa de custos por fase do projeto |

## 💡 Casos de Uso Comuns

### Upload de Vídeo

```typescript
// Backend
const video = await cloudflareStreamService.uploadVideo(file, {
  title: 'Aula 01 - Introdução',
  description: 'Primeira aula do curso',
});

// Salvar no banco
await prisma.video.create({
  data: {
    title: video.meta.name,
    cloudflareId: video.uid,
    status: 'PROCESSING',
  },
});
```

### Obter URL de Streaming

```typescript
// Backend
const { url, expiresAt } = await videosService.getStreamUrl(
  videoId,
  userId
);

// Frontend
<VideoPlayer videoId={videoId} />
```

### Upload Direto para R2

```typescript
// Backend - Gerar presigned URL
const { uploadUrl, key } = await uploadsService.generatePresignedUploadUrl(
  'videos/temp/video.mp4',
  'video/mp4'
);

// Frontend - Upload direto
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type },
});
```

## 📊 Métricas e Monitoramento

### Métricas Importantes

- **Upload Success Rate**: > 99%
- **Processing Time**: < 2x video duration
- **Start Time**: < 3s
- **Buffering Rate**: < 1%
- **Completion Rate**: > 70%

### Dashboard de Custos

```typescript
interface CostMetrics {
  storageMinutes: number;      // Minutos armazenados
  deliveryMinutes: number;     // Minutos entregues
  storageGB: number;           // GB em R2
  costPerUser: number;         // Custo por usuário
  costPerView: number;         // Custo por visualização
}
```

## 💰 Custos Estimados

| Fase | Usuários | Vídeos | Custo/mês |
|------|----------|--------|-----------|
| MVP | 1K | 50 | $83 |
| Beta | 10K | 200 | $1.472 |
| Launch | 50K | 500 | $10.579 |
| Scale | 200K | 1.000 | $54.159 |

Ver [cost-estimation.md](docs/cost-estimation.md) para detalhes completos.

## 🔒 Segurança

### Checklist de Segurança

- ✅ Signed URLs habilitadas
- ✅ Domínios permitidos configurados
- ✅ API Token com permissões mínimas
- ✅ Webhook signature validation
- ✅ CORS configurado corretamente
- ✅ Rate limiting implementado
- ✅ Logs de acesso habilitados

### Boas Práticas

1. **Nunca exponha API tokens no frontend**
2. **Sempre use signed URLs em produção**
3. **Configure expiração curta (1 hora)**
4. **Implemente renovação automática de tokens**
5. **Monitore uso e custos regularmente**
6. **Configure alertas de falhas**

## 🆘 Suporte

### Problemas Comuns

| Problema | Solução |
|----------|---------|
| Upload falha | Verificar API token e permissões |
| Vídeo não processa | Verificar formato e codec |
| CORS error | Verificar configuração CORS no R2 |
| Webhook não recebido | Verificar URL e signature |

Ver [troubleshooting.md](docs/troubleshooting.md) para mais detalhes.

### Contato

- **Cloudflare Support**: https://support.cloudflare.com
- **Community Forum**: https://community.cloudflare.com
- **Status Page**: https://www.cloudflarestatus.com

## 📚 Referências

### Documentação Oficial

- [Cloudflare Stream](https://developers.cloudflare.com/stream/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Stream API Reference](https://developers.cloudflare.com/api/operations/stream-videos-list-videos)
- [R2 API Reference](https://developers.cloudflare.com/api/operations/r2-list-buckets)

### Recursos Adicionais

- [ADR-003: Video Streaming Strategy](../../docs/decisions/ADR-003-video-streaming-strategy.md)
- [System Architecture](../../docs/architecture/system-overview.md)
- [Project Timeline](../../TIMELINE_PROJETO_CIRURGIAO.md)

## 🔄 Atualizações

### Changelog

- **09/11/2025**: Documentação inicial criada
  - Configuração Stream completa
  - Configuração R2 completa
  - Webhooks configurados
  - CORS configurado
  - Troubleshooting guide
  - Cost estimation

### Próximos Passos

- [ ] Implementar CDN configuration
- [ ] Adicionar cache policies
- [ ] Criar scripts de automação
- [ ] Implementar dashboard de custos
- [ ] Adicionar testes de integração

---

**Última Atualização**: 09/11/2025  
**Responsável**: Carolina (DevOps Engineer)  
**Status**: ✅ Completo

**Semanas 3-4 do Projeto Cirurgião**
