import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('thumbnail')
  @UseInterceptors(FileInterceptor('file'))
  async uploadThumbnail(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    // Validar tipo de arquivo
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Apenas imagens são permitidas');
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Arquivo muito grande. Máximo 5MB');
    }

    const url = await this.uploadService.uploadToR2(file, 'thumbnails');

    return { url };
  }
}
