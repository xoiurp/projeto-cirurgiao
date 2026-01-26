import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TranscriptsService } from './transcripts.service';
import { CreateTranscriptDto, UploadAWSTranscriptDto } from './dto/create-transcript.dto';
import { FirebaseAuthGuard } from '../firebase/guards/firebase-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Transcripts')
@Controller()
export class TranscriptsController {
  constructor(private readonly transcriptsService: TranscriptsService) {}

  /**
   * Obter transcrição de um vídeo (público para alunos autenticados)
   */
  @Get('videos/:videoId/transcript')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter transcrição de um vídeo' })
  @ApiResponse({ status: 200, description: 'Transcrição encontrada' })
  @ApiResponse({ status: 404, description: 'Transcrição não encontrada' })
  async getTranscript(@Param('videoId') videoId: string) {
    const transcript = await this.transcriptsService.findByVideoId(videoId);
    return transcript || { message: 'Transcrição não disponível para este vídeo' };
  }

  /**
   * Verificar se um vídeo tem transcrição
   */
  @Get('videos/:videoId/transcript/exists')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar se vídeo tem transcrição' })
  @ApiResponse({ status: 200, description: 'Status da transcrição' })
  async hasTranscript(@Param('videoId') videoId: string) {
    const exists = await this.transcriptsService.hasTranscript(videoId);
    return { hasTranscript: exists };
  }

  /**
   * Criar ou atualizar transcrição (apenas admin)
   */
  @Post('videos/:videoId/transcript')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar ou atualizar transcrição de um vídeo' })
  @ApiResponse({ status: 201, description: 'Transcrição criada/atualizada' })
  @ApiResponse({ status: 404, description: 'Vídeo não encontrado' })
  async createOrUpdateTranscript(
    @Param('videoId') videoId: string,
    @Body() createTranscriptDto: CreateTranscriptDto,
  ) {
    return this.transcriptsService.createOrUpdate(videoId, createTranscriptDto);
  }

  /**
   * Upload de transcrição do AWS Transcribe (apenas admin)
   */
  @Post('videos/:videoId/transcript/aws')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload de transcrição do AWS Transcribe' })
  @ApiResponse({ status: 201, description: 'Transcrição importada do AWS' })
  @ApiResponse({ status: 404, description: 'Vídeo não encontrado' })
  async uploadAWSTranscript(
    @Param('videoId') videoId: string,
    @Body() uploadDto: UploadAWSTranscriptDto,
  ) {
    return this.transcriptsService.createFromAWS(videoId, uploadDto.awsTranscriptJson);
  }

  /**
   * Remover transcrição (apenas admin)
   */
  @Delete('videos/:videoId/transcript')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover transcrição de um vídeo' })
  @ApiResponse({ status: 204, description: 'Transcrição removida' })
  @ApiResponse({ status: 404, description: 'Transcrição não encontrada' })
  async removeTranscript(@Param('videoId') videoId: string) {
    await this.transcriptsService.remove(videoId);
  }
}
