# Cloudflare Stream - Guia de Configuração

## 📋 Informações do Projeto

- **Account ID**: `ad41f4e2927a6daf25f7c7d6891e31bd`
- **Customer Code**: `mcykto8a2uaqo5xu`
- **API Token**: Configurado em `.env`
- **Dashboard**: https://dash.cloudflare.com/ad41f4e2927a6daf25f7c7d6891e31bd/stream

## 🎯 Objetivo

Configurar o Cloudflare Stream para hospedagem, transcodificação e entrega de vídeos educacionais do Projeto Cirurgião.

## 📚 Pré-requisitos

- Conta Cloudflare ativa
- API Token com permissões de Stream
- Acesso ao dashboard da Cloudflare

## 🚀 Passo a Passo

### 1. Habilitar Cloudflare Stream

1. Acesse o [Dashboard da Cloudflare](https://dash.cloudflare.com)
2. Selecione sua conta: `ad41f4e2927a6daf25f7c7d6891e31bd`
3. No menu lateral, clique em **Stream**
4. Clique em **Enable Stream**
5. Aceite os termos de serviço

### 2. Configurar API Token

#### Criar Token (se necessário)

1. Vá para **My Profile** > **API Tokens**
2. Clique em **Create Token**
3. Use o template **Edit Cloudflare Stream**
4. Configure as permissões:
   ```
   Account - Stream:Edit
   Account - Stream:Read
   ```
5. Defina Account Resources:
   ```
   Include - Specific account - ad41f4e2927a6daf25f7c7d6891e31bd
   ```
6. Clique em **Continue to summary**
7. Clique em **Create Token**
8. **IMPORTANTE**: Copie o token e salve no `.env`:
   ```env
   CLOUDFLARE_API_TOKEN=seu_token_aqui
   CLOUDFLARE_ACCOUNT_ID=ad41f4e2927a6daf25f7c7d6891e31bd
   CLOUDFLARE_STREAM_CUSTOMER_CODE=mcykto8a2uaqo5xu
   ```

### 3. Configurações Globais do Stream

#### 3.1 Configurações de Segurança

1. No dashboard do Stream, vá para **Settings**
2. Configure **Signed URLs**:
   - ✅ Enable "Require signed URLs"
   - Isso garante que apenas usuários autorizados possam acessar os vídeos

#### 3.2 Domínios Permitidos

Configure os domínios que podem embedar seus vídeos:

```json
{
  "allowedOrigins": [
    "https://cirurgiao.com",
    "https://www.cirurgiao.com",
    "https://app.cirurgiao.com",
    "http://localhost:3000",
    "http://localhost:3001"
  ]
}
```

**Via API**:
```bash
curl -X PATCH \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/settings" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "allowedOrigins": [
      "https://cirurgiao.com",
      "https://www.cirurgiao.com",
      "https://app.cirurgiao.com"
    ]
  }'
```

#### 3.3 Configurações de Transcodificação

O Cloudflare Stream transcodifica automaticamente para múltiplas resoluções:

- **360p** (640x360) - Mobile/Conexões lentas
- **540p** (960x540) - Padrão mobile
- **720p** (1280x720) - HD
- **1080p** (1920x1080) - Full HD

**Configurações recomendadas**:
```json
{
  "requireSignedURLs": true,
  "allowedOrigins": ["https://cirurgiao.com"],
  "thumbnailTimestampPct": 0.1,
  "watermark": {
    "uid": "watermark_uid_aqui"
  }
}
```

### 4. Upload de Vídeos

#### 4.1 Via Dashboard (Teste)

1. Vá para **Stream** > **Videos**
2. Clique em **Upload**
3. Selecione um vídeo de teste
4. Aguarde o processamento
5. Verifique o status: `queued` → `inprogress` → `ready`

#### 4.2 Via API (Produção)

**Upload Direto**:
```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -F "file=@/path/to/video.mp4" \
  -F 'meta={"name":"Título do Vídeo","requireSignedURLs":true}'
```

**Upload via URL**:
```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/copy" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/video.mp4",
    "meta": {
      "name": "Título do Vídeo"
    },
    "requireSignedURLs": true
  }'
```

**Resposta de Sucesso**:
```json
{
  "success": true,
  "result": {
    "uid": "abc123def456",
    "status": {
      "state": "queued",
      "pctComplete": 0
    },
    "meta": {
      "name": "Título do Vídeo"
    },
    "created": "2025-11-09T12:00:00Z",
    "modified": "2025-11-09T12:00:00Z",
    "size": 52428800,
    "preview": "https://customer-mcykto8a2uaqo5xu.cloudflarestream.com/abc123def456/watch",
    "thumbnail": "https://customer-mcykto8a2uaqo5xu.cloudflarestream.com/abc123def456/thumbnails/thumbnail.jpg",
    "readyToStream": false,
    "requireSignedURLs": true
  }
}
```

### 5. Gerar Signed URLs

Para segurança, todos os vídeos devem usar signed URLs:

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/abc123def456/token" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "abc123def456",
    "exp": 1699545600,
    "nbf": 1699459200,
    "downloadable": false,
    "accessRules": [
      {
        "type": "ip.geoip.country",
        "action": "allow",
        "country": ["BR"]
      }
    ]
  }'
```

**Parâmetros**:
- `exp`: Timestamp de expiração (Unix timestamp)
- `nbf`: Not Before - quando o token se torna válido
- `downloadable`: Permitir download (false para streaming apenas)
- `accessRules`: Regras de acesso (opcional)

**Resposta**:
```json
{
  "success": true,
  "result": {
    "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
  }
}
```

**URL Final**:
```
https://customer-mcykto8a2uaqo5xu.cloudflarestream.com/abc123def456/manifest/video.m3u8?token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ...
```

### 6. Verificar Status do Vídeo

```bash
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/abc123def456" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

**Estados Possíveis**:
- `queued`: Na fila para processamento
- `inprogress`: Sendo processado
- `ready`: Pronto para streaming
- `error`: Erro no processamento

### 7. Configurar Thumbnails

#### Thumbnail Automático
O Cloudflare gera automaticamente um thumbnail em 10% do vídeo.

#### Thumbnail Customizado
```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/abc123def456/thumbnails" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -F "file=@/path/to/thumbnail.jpg"
```

#### Thumbnail em Timestamp Específico
```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/abc123def456/thumbnails" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "time": 30.5,
    "unit": "seconds"
  }'
```

### 8. Adicionar Legendas/Subtítulos

```bash
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/abc123def456/captions/pt-BR" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -F "file=@/path/to/subtitles.vtt"
```

**Formatos Suportados**:
- WebVTT (.vtt)
- SRT (.srt)

**Idiomas Comuns**:
- `pt-BR`: Português (Brasil)
- `en-US`: Inglês (EUA)
- `es-ES`: Espanhol (Espanha)

### 9. Configurar Watermark (Opcional)

#### Upload do Watermark
```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/watermarks" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -F "file=@/path/to/logo.png" \
  -F 'name=Logo Cirurgião' \
  -F 'opacity=0.75' \
  -F 'padding=0.05' \
  -F 'scale=0.15' \
  -F 'position=upperRight'
```

#### Aplicar Watermark ao Vídeo
```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/abc123def456/watermark" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "watermark_uid_aqui"
  }'
```

### 10. Deletar Vídeo

```bash
curl -X DELETE \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/abc123def456" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

## 📊 Monitoramento

### Analytics via Dashboard

1. Acesse **Stream** > **Analytics**
2. Visualize métricas:
   - Total de views
   - Minutos assistidos
   - Completion rate
   - Distribuição geográfica
   - Qualidade de streaming

### Analytics via API

```bash
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/analytics/views?since=2025-11-01T00:00:00Z&until=2025-11-09T23:59:59Z" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

## 🔒 Segurança

### Checklist de Segurança

- ✅ Signed URLs habilitadas
- ✅ Domínios permitidos configurados
- ✅ API Token com permissões mínimas
- ✅ Tokens com expiração (1 hora recomendado)
- ✅ HTTPS obrigatório
- ✅ Renovação automática de tokens no player

### Boas Práticas

1. **Nunca exponha o API Token no frontend**
2. **Sempre use signed URLs em produção**
3. **Configure expiração curta (1 hora)**
4. **Implemente renovação automática**
5. **Monitore uso e custos**
6. **Configure alertas de falhas**

## 🧪 Testes

### Teste de Upload

```bash
# 1. Upload de vídeo de teste
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -F "file=@test-video.mp4" \
  -F 'meta={"name":"Teste Upload"}'

# 2. Verificar status
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/{video_uid}" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"

# 3. Gerar signed URL
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/{video_uid}/token" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"exp": 1699545600}'

# 4. Testar playback no navegador
# Abrir: https://customer-mcykto8a2uaqo5xu.cloudflarestream.com/{video_uid}/watch?token={token}
```

## 📚 Referências

- [Cloudflare Stream Docs](https://developers.cloudflare.com/stream/)
- [Stream API Reference](https://developers.cloudflare.com/api/operations/stream-videos-list-videos)
- [Signed URLs](https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/)
- [Webhooks](https://developers.cloudflare.com/stream/webhooks/)

## 🆘 Troubleshooting

Ver: [troubleshooting.md](../docs/troubleshooting.md)

## 💰 Custos

Ver: [cost-estimation.md](../docs/cost-estimation.md)

---

**Última Atualização**: 09/11/2025  
**Responsável**: Carolina (DevOps Engineer)  
**Status**: ✅ Configurado
