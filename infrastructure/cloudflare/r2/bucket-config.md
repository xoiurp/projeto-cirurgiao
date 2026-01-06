# Cloudflare R2 - Configuração de Bucket

## 📋 Visão Geral

Cloudflare R2 é um serviço de object storage compatível com S3, sem custos de egress (saída de dados). Será usado para armazenar vídeos originais, thumbnails e outros assets.

## 🎯 Objetivo

Configurar bucket R2 para armazenamento de vídeos e assets do Projeto Cirurgião, integrado com o Cloudflare Stream.

## 📚 Informações do Bucket

- **Bucket Name**: `s3-projeto-cirurgiao`
- **Account ID**: `ad41f4e2927a6daf25f7c7d6891e31bd`
- **Region**: auto (global)
- **Endpoint**: `https://ad41f4e2927a6daf25f7c7d6891e31bd.r2.cloudflarestorage.com`

## 🚀 Passo a Passo

### 1. Criar Bucket R2

#### Via Dashboard

1. Acesse o [Dashboard da Cloudflare](https://dash.cloudflare.com)
2. Selecione sua conta: `ad41f4e2927a6daf25f7c7d6891e31bd`
3. No menu lateral, clique em **R2**
4. Clique em **Create bucket**
5. Configure:
   - **Bucket name**: `s3-projeto-cirurgiao`
   - **Location**: Automatic (recomendado)
6. Clique em **Create bucket**

#### Via API

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/r2/buckets" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "s3-projeto-cirurgiao",
    "locationHint": "auto"
  }'
```

**Resposta**:
```json
{
  "success": true,
  "result": {
    "name": "s3-projeto-cirurgiao",
    "creation_date": "2025-11-09T12:00:00Z",
    "location": "auto"
  }
}
```

### 2. Criar Access Keys

#### Via Dashboard

1. No bucket criado, vá para **Settings**
2. Role até **R2 API Tokens**
3. Clique em **Create API Token**
4. Configure:
   - **Token name**: `projeto-cirurgiao-api`
   - **Permissions**: 
     - ✅ Object Read & Write
     - ✅ Bucket Read
   - **Bucket**: `s3-projeto-cirurgiao`
   - **TTL**: Never expire (ou defina expiração)
5. Clique em **Create API Token**
6. **IMPORTANTE**: Copie as credenciais:
   ```
   Access Key ID: <access_key_id>
   Secret Access Key: <secret_access_key>
   ```

#### Salvar no .env

```env
# Cloudflare R2
R2_ACCOUNT_ID=ad41f4e2927a6daf25f7c7d6891e31bd
R2_ACCESS_KEY_ID=seu_access_key_id_aqui
R2_SECRET_ACCESS_KEY=seu_secret_access_key_aqui
R2_BUCKET_NAME=s3-projeto-cirurgiao
R2_ENDPOINT=https://ad41f4e2927a6daf25f7c7d6891e31bd.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### 3. Configurar Public Access (Opcional)

Para servir assets públicos (thumbnails, etc):

1. No bucket, vá para **Settings**
2. Em **Public Access**, clique em **Allow Access**
3. Será gerada uma URL pública: `https://pub-xxxxx.r2.dev`
4. Configure domínio customizado (opcional):
   - Vá para **Custom Domains**
   - Adicione: `cdn.cirurgiao.com`
   - Configure DNS conforme instruções

### 4. Estrutura de Diretórios

Organize os arquivos no bucket:

```
s3-projeto-cirurgiao/
├── videos/
│   ├── originals/          # Vídeos originais (backup)
│   │   └── {video_id}/
│   │       └── original.mp4
│   ├── thumbnails/         # Thumbnails customizados
│   │   └── {video_id}/
│   │       ├── thumb_360.jpg
│   │       ├── thumb_720.jpg
│   │       └── thumb_1080.jpg
│   └── subtitles/          # Legendas
│       └── {video_id}/
│           ├── pt-BR.vtt
│           └── en-US.vtt
├── courses/
│   └── {course_id}/
│       ├── cover.jpg
│       └── banner.jpg
├── users/
│   └── {user_id}/
│       └── avatar.jpg
└── temp/                   # Uploads temporários
    └── {upload_id}/
```

## 💻 Integração com Backend

### 1. Instalar SDK

```bash
cd backend-api
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. Criar Service R2

```typescript
// backend-api/src/modules/cloudflare/cloudflare-r2.service.ts
import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

@Injectable()
export class CloudflareR2Service {
  private readonly logger = new Logger(CloudflareR2Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME;
    this.publicUrl = process.env.R2_PUBLIC_URL;

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * Upload de arquivo
   */
  async uploadFile(
    key: string,
    file: Buffer | Readable,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
        Metadata: metadata,
      });

      await this.s3Client.send(command);

      this.logger.log(`File uploaded: ${key}`);

      // Retornar URL pública (se bucket for público)
      return `${this.publicUrl}/${key}`;
    } catch (error) {
      this.logger.error(`Error uploading file ${key}:`, error);
      throw error;
    }
  }

  /**
   * Upload de vídeo original (backup)
   */
  async uploadVideoOriginal(
    videoId: string,
    file: Buffer,
  ): Promise<string> {
    const key = `videos/originals/${videoId}/original.mp4`;
    return this.uploadFile(key, file, 'video/mp4', {
      videoId,
      uploadedAt: new Date().toISOString(),
    });
  }

  /**
   * Upload de thumbnail
   */
  async uploadThumbnail(
    videoId: string,
    file: Buffer,
    resolution: '360' | '720' | '1080',
  ): Promise<string> {
    const key = `videos/thumbnails/${videoId}/thumb_${resolution}.jpg`;
    return this.uploadFile(key, file, 'image/jpeg', {
      videoId,
      resolution,
    });
  }

  /**
   * Upload de legenda
   */
  async uploadSubtitle(
    videoId: string,
    file: Buffer,
    language: string,
  ): Promise<string> {
    const key = `videos/subtitles/${videoId}/${language}.vtt`;
    return this.uploadFile(key, file, 'text/vtt', {
      videoId,
      language,
    });
  }

  /**
   * Upload de avatar de usuário
   */
  async uploadUserAvatar(
    userId: string,
    file: Buffer,
  ): Promise<string> {
    const key = `users/${userId}/avatar.jpg`;
    return this.uploadFile(key, file, 'image/jpeg', {
      userId,
    });
  }

  /**
   * Upload de capa de curso
   */
  async uploadCourseCover(
    courseId: string,
    file: Buffer,
  ): Promise<string> {
    const key = `courses/${courseId}/cover.jpg`;
    return this.uploadFile(key, file, 'image/jpeg', {
      courseId,
    });
  }

  /**
   * Download de arquivo
   */
  async downloadFile(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const stream = response.Body as Readable;

      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
      });
    } catch (error) {
      this.logger.error(`Error downloading file ${key}:`, error);
      throw error;
    }
  }

  /**
   * Gerar URL assinada (para arquivos privados)
   */
  async getSignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      return url;
    } catch (error) {
      this.logger.error(`Error generating signed URL for ${key}:`, error);
      throw error;
    }
  }

  /**
   * Deletar arquivo
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);

      this.logger.log(`File deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting file ${key}:`, error);
      throw error;
    }
  }

  /**
   * Verificar se arquivo existe
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Listar arquivos
   */
  async listFiles(prefix: string): Promise<string[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
      });

      const response = await this.s3Client.send(command);

      return response.Contents?.map((obj) => obj.Key) || [];
    } catch (error) {
      this.logger.error(`Error listing files with prefix ${prefix}:`, error);
      throw error;
    }
  }

  /**
   * Obter metadados do arquivo
   */
  async getFileMetadata(key: string): Promise<Record<string, string>> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      return {
        contentType: response.ContentType,
        contentLength: response.ContentLength?.toString(),
        lastModified: response.LastModified?.toISOString(),
        ...response.Metadata,
      };
    } catch (error) {
      this.logger.error(`Error getting metadata for ${key}:`, error);
      throw error;
    }
  }
}
```

### 3. Exemplo de Uso no Controller

```typescript
// backend-api/src/modules/videos/videos.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudflareR2Service } from '@/modules/cloudflare/cloudflare-r2.service';
import { CloudflareStreamService } from '@/modules/cloudflare/cloudflare-stream.service';

@Controller('videos')
export class VideosController {
  constructor(
    private readonly r2Service: CloudflareR2Service,
    private readonly streamService: CloudflareStreamService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: { title: string; description: string },
  ) {
    // 1. Upload para R2 (backup)
    const r2Url = await this.r2Service.uploadVideoOriginal(
      'temp-id',
      file.buffer,
    );

    // 2. Upload para Stream (processamento)
    const streamVideo = await this.streamService.uploadVideo(
      file,
      metadata,
    );

    // 3. Salvar no banco
    const video = await this.prisma.video.create({
      data: {
        title: metadata.title,
        description: metadata.description,
        cloudflareId: streamVideo.uid,
        r2BackupUrl: r2Url,
        status: 'PROCESSING',
      },
    });

    return video;
  }
}
```

## 🔒 Segurança

### 1. Bucket Policies

Configure políticas de acesso no bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadThumbnails",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::s3-projeto-cirurgiao/videos/thumbnails/*"
    },
    {
      "Sid": "PublicReadCourseCover",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::s3-projeto-cirurgiao/courses/*/cover.jpg"
    }
  ]
}
```

### 2. Lifecycle Rules

Configure regras de ciclo de vida para otimizar custos:

```json
{
  "Rules": [
    {
      "Id": "DeleteTempUploads",
      "Status": "Enabled",
      "Prefix": "temp/",
      "Expiration": {
        "Days": 1
      }
    },
    {
      "Id": "DeleteOldBackups",
      "Status": "Enabled",
      "Prefix": "videos/originals/",
      "Expiration": {
        "Days": 90
      }
    }
  ]
}
```

## 📊 Monitoramento

### Métricas Importantes

- **Storage Used**: Total de dados armazenados
- **Request Count**: Número de requisições
- **Bandwidth**: Dados transferidos (sem custo!)
- **Error Rate**: Taxa de erros

### Logs

```typescript
// Registrar todas as operações
this.logger.log({
  operation: 'upload',
  key: key,
  size: file.length,
  contentType: contentType,
  timestamp: new Date().toISOString(),
});
```

## 💰 Custos

### Pricing R2

- **Storage**: $0.015 / GB / mês
- **Class A Operations** (write): $4.50 / milhão
- **Class B Operations** (read): $0.36 / milhão
- **Egress**: **$0** (GRÁTIS!)

### Estimativa de Custos

```
Exemplo:
- 100 vídeos de 500MB = 50GB
- Storage: 50GB × $0.015 = $0.75/mês
- 10K uploads/mês: 10K × $4.50/1M = $0.045
- 100K downloads/mês: 100K × $0.36/1M = $0.036
- Egress: $0 (GRÁTIS!)
- Total: ~$0.83/mês
```

## 🧪 Testes

### Teste de Upload

```bash
# Upload via AWS CLI (compatível com R2)
aws s3 cp test-video.mp4 \
  s3://s3-projeto-cirurgiao/videos/test/test-video.mp4 \
  --endpoint-url https://ad41f4e2927a6daf25f7c7d6891e31bd.r2.cloudflarestorage.com \
  --profile cloudflare-r2
```

### Configurar AWS CLI

```bash
# ~/.aws/credentials
[cloudflare-r2]
aws_access_key_id = seu_access_key_id
aws_secret_access_key = seu_secret_access_key

# ~/.aws/config
[profile cloudflare-r2]
region = auto
output = json
```

## 📚 Referências

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [R2 API Reference](https://developers.cloudflare.com/api/operations/r2-list-buckets)
- [S3 Compatibility](https://developers.cloudflare.com/r2/api/s3/api/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)

---

**Última Atualização**: 09/11/2025  
**Responsável**: Carolina (DevOps Engineer)  
**Status**: ✅ Configurado
