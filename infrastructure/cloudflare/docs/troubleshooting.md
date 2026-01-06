# Cloudflare Stream & R2 - Troubleshooting

## 📋 Visão Geral

Guia de solução de problemas comuns ao trabalhar com Cloudflare Stream e R2.

## 🎬 Cloudflare Stream

### Problema: Upload Falha

#### Sintomas
- Erro 401 Unauthorized
- Erro 403 Forbidden
- Timeout durante upload

#### Causas Possíveis

1. **API Token Inválido**
   ```bash
   # Verificar token
   curl -X GET \
     "https://api.cloudflare.com/client/v4/user/tokens/verify" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
   ```

2. **Permissões Insuficientes**
   - Token precisa de permissão `Stream:Edit`
   - Verificar no dashboard: My Profile > API Tokens

3. **Arquivo Muito Grande**
   - Limite: 30GB por vídeo
   - Solução: Comprimir vídeo antes do upload

4. **Formato Não Suportado**
   - Formatos suportados: MP4, MOV, MKV, AVI, FLV, MPEG-2 TS, MPEG-2 PS, MXF, LXF, GXF, 3GP, WebM, MPG, QuickTime
   - Solução: Converter para MP4 (H.264)

#### Soluções

```typescript
// Adicionar retry logic
async uploadVideoWithRetry(file: File, maxRetries = 3): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await this.uploadVideo(file);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Esperar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
}
```

### Problema: Vídeo Não Processa

#### Sintomas
- Status permanece em `queued` ou `inprogress`
- Webhook não é recebido
- Erro no processamento

#### Diagnóstico

```bash
# Verificar status do vídeo
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/{video_id}" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

#### Causas Possíveis

1. **Codec Não Suportado**
   - Erro: `ERR_CODEC_UNSUPPORTED`
   - Solução: Converter para H.264/AAC

2. **Arquivo Corrompido**
   - Erro: `ERR_INVALID_FILE`
   - Solução: Verificar integridade do arquivo

3. **Processamento Lento**
   - Vídeos grandes podem levar tempo
   - Tempo estimado: ~2x duração do vídeo

#### Soluções

```typescript
// Polling para verificar status
async waitForVideoReady(videoId: string, timeout = 600000): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const video = await this.getVideoDetails(videoId);
    
    if (video.status.state === 'ready') {
      return;
    }
    
    if (video.status.state === 'error') {
      throw new Error(`Video processing failed: ${video.status.errorReasonText}`);
    }
    
    // Aguardar 10 segundos antes de verificar novamente
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  
  throw new Error('Video processing timeout');
}
```

### Problema: Signed URL Não Funciona

#### Sintomas
- Erro 403 ao acessar vídeo
- Player não carrega
- Token inválido

#### Causas Possíveis

1. **Token Expirado**
   ```typescript
   // Verificar expiração
   const tokenPayload = JSON.parse(atob(token.split('.')[1]));
   const expiresAt = new Date(tokenPayload.exp * 1000);
   console.log('Token expires at:', expiresAt);
   ```

2. **Domínio Não Permitido**
   - Verificar `allowedOrigins` no Stream
   - Adicionar domínio à lista

3. **requireSignedURLs Não Habilitado**
   - Verificar configuração do vídeo
   - Habilitar no dashboard ou via API

#### Soluções

```typescript
// Implementar renovação automática
class TokenManager {
  private token: string;
  private expiresAt: Date;
  
  async getToken(videoId: string): Promise<string> {
    // Renovar se expirar em menos de 5 minutos
    if (!this.token || Date.now() > this.expiresAt.getTime() - 5 * 60 * 1000) {
      const response = await fetch(`/api/v1/videos/${videoId}/stream-url`);
      const data = await response.json();
      
      this.token = data.token;
      this.expiresAt = new Date(data.expiresAt);
    }
    
    return this.token;
  }
}
```

### Problema: Webhook Não Recebido

#### Sintomas
- Vídeo processado mas banco não atualizado
- Webhook não chega ao endpoint

#### Diagnóstico

```bash
# Verificar configuração do webhook
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream/webhook" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

#### Causas Possíveis

1. **URL Não Acessível**
   - Verificar se URL é pública
   - Testar com curl

2. **Validação de Assinatura Falhando**
   - Verificar `CLOUDFLARE_WEBHOOK_SECRET`
   - Comparar com secret configurado

3. **Endpoint Retornando Erro**
   - Webhook espera 200 OK
   - Verificar logs do backend

#### Soluções

```typescript
// Adicionar logs detalhados
@Post('stream')
async handleStreamWebhook(
  @Body() payload: any,
  @Headers() headers: any,
) {
  this.logger.log({
    event: 'webhook_received',
    payload,
    headers,
    timestamp: new Date().toISOString(),
  });
  
  try {
    this.validateSignature(payload, headers['webhook-signature']);
    await this.processEvent(payload);
    return { success: true };
  } catch (error) {
    this.logger.error('Webhook processing failed:', error);
    throw error;
  }
}
```

## 💾 Cloudflare R2

### Problema: Upload para R2 Falha

#### Sintomas
- Erro 403 Forbidden
- Erro 400 Bad Request
- Connection timeout

#### Causas Possíveis

1. **Credenciais Inválidas**
   ```bash
   # Testar credenciais
   aws s3 ls \
     --endpoint-url https://ad41f4e2927a6daf25f7c7d6891e31bd.r2.cloudflarestorage.com \
     --profile cloudflare-r2
   ```

2. **CORS Não Configurado**
   - Verificar configuração CORS
   - Adicionar origem necessária

3. **Bucket Não Existe**
   - Verificar nome do bucket
   - Criar bucket se necessário

#### Soluções

```typescript
// Adicionar tratamento de erros específicos
async uploadFile(key: string, file: Buffer): Promise<string> {
  try {
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
    }));
    
    return `${this.publicUrl}/${key}`;
  } catch (error) {
    if (error.name === 'NoSuchBucket') {
      throw new Error(`Bucket ${this.bucketName} does not exist`);
    }
    
    if (error.name === 'AccessDenied') {
      throw new Error('Invalid R2 credentials or insufficient permissions');
    }
    
    throw error;
  }
}
```

### Problema: CORS Error

#### Sintomas
- "No 'Access-Control-Allow-Origin' header"
- Preflight request fails
- Method not allowed

#### Diagnóstico

```bash
# Testar CORS
curl -X OPTIONS \
  "https://pub-xxxxx.r2.dev/test.jpg" \
  -H "Origin: https://cirurgiao.com" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

#### Soluções

1. **Verificar Configuração CORS**
   ```bash
   aws s3api get-bucket-cors \
     --bucket s3-projeto-cirurgiao \
     --endpoint-url https://ad41f4e2927a6daf25f7c7d6891e31bd.r2.cloudflarestorage.com \
     --profile cloudflare-r2
   ```

2. **Atualizar CORS**
   ```bash
   aws s3api put-bucket-cors \
     --bucket s3-projeto-cirurgiao \
     --cors-configuration file://cors-config.json \
     --endpoint-url https://ad41f4e2927a6daf25f7c7d6891e31bd.r2.cloudflarestorage.com \
     --profile cloudflare-r2
   ```

### Problema: Presigned URL Não Funciona

#### Sintomas
- URL retorna 403
- URL expira imediatamente
- Signature mismatch

#### Causas Possíveis

1. **Clock Skew**
   - Relógio do servidor desincronizado
   - Solução: Sincronizar relógio

2. **URL Modificada**
   - Query parameters alterados
   - Solução: Não modificar URL gerada

3. **Expiração Incorreta**
   ```typescript
   // Verificar expiração
   const url = new URL(presignedUrl);
   const expires = url.searchParams.get('X-Amz-Expires');
   console.log('URL expires in:', expires, 'seconds');
   ```

#### Soluções

```typescript
// Gerar URL com validação
async getPresignedUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: this.bucketName,
    Key: key,
  });
  
  const url = await getSignedUrl(this.s3Client, command, {
    expiresIn: 3600,
  });
  
  // Validar URL gerada
  try {
    new URL(url);
  } catch (error) {
    throw new Error('Invalid presigned URL generated');
  }
  
  return url;
}
```

## 🔧 Ferramentas de Diagnóstico

### Script de Teste Completo

```bash
#!/bin/bash

echo "=== Cloudflare Stream & R2 Diagnostics ==="

# 1. Testar API Token
echo -e "\n1. Testing API Token..."
curl -s -X GET \
  "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq .

# 2. Listar vídeos
echo -e "\n2. Listing videos..."
curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/stream" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq '.result | length'

# 3. Verificar webhook
echo -e "\n3. Checking webhook configuration..."
curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/stream/webhook" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq .

# 4. Testar R2
echo -e "\n4. Testing R2 access..."
aws s3 ls \
  --endpoint-url https://$CLOUDFLARE_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile cloudflare-r2

# 5. Verificar CORS
echo -e "\n5. Checking CORS configuration..."
aws s3api get-bucket-cors \
  --bucket s3-projeto-cirurgiao \
  --endpoint-url https://$CLOUDFLARE_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile cloudflare-r2

echo -e "\n=== Diagnostics Complete ==="
```

### Logs Estruturados

```typescript
// Logger helper
class CloudflareLogger {
  log(operation: string, data: any) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      service: 'cloudflare',
      operation,
      ...data,
    }));
  }
  
  error(operation: string, error: any) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      service: 'cloudflare',
      operation,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    }));
  }
}
```

## 📞 Suporte

### Quando Contatar Suporte Cloudflare

1. **Problemas Persistentes de Processamento**
   - Vídeos não processam após 24h
   - Erros recorrentes sem causa aparente

2. **Problemas de Performance**
   - Latência alta consistente
   - Buffering excessivo

3. **Problemas de Billing**
   - Cobranças inesperadas
   - Dúvidas sobre pricing

### Informações para Fornecer

- Account ID: `ad41f4e2927a6daf25f7c7d6891e31bd`
- Video ID (se aplicável)
- Timestamp do problema
- Logs relevantes
- Steps to reproduce

### Links Úteis

- [Cloudflare Support](https://support.cloudflare.com)
- [Community Forum](https://community.cloudflare.com)
- [Status Page](https://www.cloudflarestatus.com)

---

**Última Atualização**: 09/11/2025  
**Responsável**: Carolina (DevOps Engineer)  
**Status**: ✅ Documentado
