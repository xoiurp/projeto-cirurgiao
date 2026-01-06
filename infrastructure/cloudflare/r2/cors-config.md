# Cloudflare R2 - Configuração de CORS

## 📋 Visão Geral

CORS (Cross-Origin Resource Sharing) permite que aplicações web de diferentes origens acessem recursos no bucket R2. É essencial para uploads diretos do frontend e acesso a assets públicos.

## 🎯 Objetivo

Configurar políticas CORS no bucket R2 para permitir uploads seguros do frontend e acesso a assets públicos.

## 🚀 Configuração

### 1. Configuração Básica de CORS

#### Via AWS CLI (S3 Compatible)

```bash
# Criar arquivo cors-config.json
cat > cors-config.json << 'EOF'
{
  "CORSRules": [
    {
      "AllowedOrigins": [
        "https://cirurgiao.com",
        "https://www.cirurgiao.com",
        "https://app.cirurgiao.com",
        "http://localhost:3000",
        "http://localhost:3001"
      ],
      "AllowedMethods": [
        "GET",
        "PUT",
        "POST",
        "DELETE",
        "HEAD"
      ],
      "AllowedHeaders": [
        "*"
      ],
      "ExposeHeaders": [
        "ETag",
        "Content-Length",
        "Content-Type"
      ],
      "MaxAgeSeconds": 3600
    }
  ]
}
EOF

# Aplicar configuração
aws s3api put-bucket-cors \
  --bucket s3-projeto-cirurgiao \
  --cors-configuration file://cors-config.json \
  --endpoint-url https://ad41f4e2927a6daf25f7c7d6891e31bd.r2.cloudflarestorage.com \
  --profile cloudflare-r2
```

### 2. Configuração por Ambiente

#### Desenvolvimento

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000"
      ],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag", "Content-Length"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

#### Produção

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": [
        "https://cirurgiao.com",
        "https://www.cirurgiao.com",
        "https://app.cirurgiao.com"
      ],
      "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
      "AllowedHeaders": [
        "Content-Type",
        "Content-Length",
        "Authorization",
        "X-Amz-Date",
        "X-Amz-Content-Sha256"
      ],
      "ExposeHeaders": ["ETag", "Content-Length"],
      "MaxAgeSeconds": 86400
    }
  ]
}
```

### 3. Configuração Granular por Tipo de Recurso

#### Assets Públicos (Thumbnails, Covers)

```json
{
  "CORSRules": [
    {
      "ID": "PublicAssets",
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag", "Content-Type"],
      "MaxAgeSeconds": 86400
    }
  ]
}
```

#### Uploads Privados (Vídeos)

```json
{
  "CORSRules": [
    {
      "ID": "PrivateUploads",
      "AllowedOrigins": [
        "https://app.cirurgiao.com"
      ],
      "AllowedMethods": ["PUT", "POST"],
      "AllowedHeaders": [
        "Content-Type",
        "Content-Length",
        "Authorization",
        "X-Amz-*"
      ],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

## 💻 Upload Direto do Frontend

### 1. Gerar Presigned URL no Backend

```typescript
// backend-api/src/modules/uploads/uploads.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class UploadsService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME;
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  async generatePresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600,
  ): Promise<{
    uploadUrl: string;
    key: string;
    expiresAt: Date;
  }> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn,
    });

    return {
      uploadUrl,
      key,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    };
  }

  async generateVideoUploadUrl(
    userId: string,
    filename: string,
  ): Promise<{
    uploadUrl: string;
    key: string;
    expiresAt: Date;
  }> {
    const uploadId = crypto.randomUUID();
    const key = `temp/${userId}/${uploadId}/${filename}`;

    return this.generatePresignedUploadUrl(key, 'video/mp4', 3600);
  }

  async generateAvatarUploadUrl(
    userId: string,
  ): Promise<{
    uploadUrl: string;
    key: string;
    expiresAt: Date;
  }> {
    const key = `users/${userId}/avatar.jpg`;

    return this.generatePresignedUploadUrl(key, 'image/jpeg', 3600);
  }
}
```

### 2. Controller para Presigned URLs

```typescript
// backend-api/src/modules/uploads/uploads.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { GetUser } from '@/modules/auth/decorators/get-user.decorator';
import { UploadsService } from './uploads.service';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('video/presigned-url')
  async getVideoUploadUrl(
    @GetUser('id') userId: string,
    @Body() body: { filename: string },
  ) {
    return this.uploadsService.generateVideoUploadUrl(
      userId,
      body.filename,
    );
  }

  @Post('avatar/presigned-url')
  async getAvatarUploadUrl(@GetUser('id') userId: string) {
    return this.uploadsService.generateAvatarUploadUrl(userId);
  }
}
```

### 3. Upload no Frontend

```typescript
// frontend-web/src/lib/upload.ts
export async function uploadToR2(
  file: File,
  type: 'video' | 'avatar',
): Promise<string> {
  // 1. Obter presigned URL do backend
  const response = await fetch(`/api/v1/uploads/${type}/presigned-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      filename: file.name,
    }),
  });

  const { uploadUrl, key } = await response.json();

  // 2. Upload direto para R2
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error('Upload failed');
  }

  return key;
}
```

### 4. Componente de Upload com Progress

```typescript
// frontend-web/src/components/upload/video-uploader.tsx
'use client';

import { useState } from 'react';
import { uploadToR2 } from '@/lib/upload';

export function VideoUploader() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      // 1. Obter presigned URL
      const response = await fetch('/api/v1/uploads/video/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          filename: file.name,
        }),
      });

      const { uploadUrl, key } = await response.json();

      // 2. Upload com progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          console.log('Upload complete:', key);
          setProgress(100);
          
          // 3. Notificar backend que upload foi concluído
          notifyUploadComplete(key);
        }
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        disabled={uploading}
      />
      {uploading && (
        <div>
          <progress value={progress} max={100} />
          <span>{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}
```

## 🧪 Testes de CORS

### 1. Teste Manual

```bash
# Testar GET com CORS
curl -X OPTIONS \
  "https://pub-xxxxx.r2.dev/videos/thumbnails/test.jpg" \
  -H "Origin: https://cirurgiao.com" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Verificar headers na resposta:
# Access-Control-Allow-Origin: https://cirurgiao.com
# Access-Control-Allow-Methods: GET, HEAD
# Access-Control-Max-Age: 86400
```

### 2. Teste de Upload

```bash
# Testar PUT com CORS
curl -X OPTIONS \
  "https://ad41f4e2927a6daf25f7c7d6891e31bd.r2.cloudflarestorage.com/s3-projeto-cirurgiao/test.jpg" \
  -H "Origin: https://app.cirurgiao.com" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

### 3. Teste no Browser

```javascript
// Console do navegador
fetch('https://pub-xxxxx.r2.dev/videos/thumbnails/test.jpg', {
  method: 'GET',
  mode: 'cors',
})
  .then(response => console.log('Success:', response))
  .catch(error => console.error('CORS Error:', error));
```

## 🔒 Segurança

### Boas Práticas

1. **Nunca use `*` em produção**
   ```json
   // ❌ Evitar
   "AllowedOrigins": ["*"]
   
   // ✅ Preferir
   "AllowedOrigins": ["https://cirurgiao.com"]
   ```

2. **Limite métodos HTTP**
   ```json
   // ❌ Evitar
   "AllowedMethods": ["*"]
   
   // ✅ Preferir
   "AllowedMethods": ["GET", "HEAD"]
   ```

3. **Especifique headers necessários**
   ```json
   // ❌ Evitar
   "AllowedHeaders": ["*"]
   
   // ✅ Preferir
   "AllowedHeaders": ["Content-Type", "Authorization"]
   ```

4. **Configure MaxAge apropriado**
   ```json
   // Desenvolvimento: 1 hora
   "MaxAgeSeconds": 3600
   
   // Produção: 24 horas
   "MaxAgeSeconds": 86400
   ```

## 🆘 Troubleshooting

### CORS Error: "No 'Access-Control-Allow-Origin' header"

**Causa**: Origem não está na lista de AllowedOrigins

**Solução**:
```bash
# Verificar configuração atual
aws s3api get-bucket-cors \
  --bucket s3-projeto-cirurgiao \
  --endpoint-url https://ad41f4e2927a6daf25f7c7d6891e31bd.r2.cloudflarestorage.com \
  --profile cloudflare-r2

# Adicionar origem
# Editar cors-config.json e reaplicar
```

### CORS Error: "Method not allowed"

**Causa**: Método HTTP não está em AllowedMethods

**Solução**: Adicionar método necessário à configuração CORS

### Preflight Request Failing

**Causa**: Headers não estão em AllowedHeaders

**Solução**: Adicionar headers necessários:
```json
"AllowedHeaders": [
  "Content-Type",
  "Authorization",
  "X-Amz-Date",
  "X-Amz-Content-Sha256"
]
```

## 📚 Referências

- [Cloudflare R2 CORS](https://developers.cloudflare.com/r2/api/s3/api/#cors)
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [AWS S3 CORS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)

---

**Última Atualização**: 09/11/2025  
**Responsável**: Carolina (DevOps Engineer)  
**Status**: ✅ Configurado
