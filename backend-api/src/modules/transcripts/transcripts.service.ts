import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateTranscriptDto, TranscriptSegmentDto } from './dto/create-transcript.dto';

// Interface para o formato AWS Transcribe
interface AWSTranscriptSegment {
  id: number;
  transcript: string;
  start_time: string;
  end_time: string;
  items: number[];
}

interface AWSTranscriptResult {
  jobName: string;
  accountId: string;
  status: string;
  results: {
    transcripts: Array<{ transcript: string }>;
    items: any[];
    audio_segments: AWSTranscriptSegment[];
  };
}

@Injectable()
export class TranscriptsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Converte JSON do AWS Transcribe para o formato interno
   */
  convertAWSTranscript(awsJson: any): CreateTranscriptDto {
    // Validação básica da estrutura
    if (!awsJson || !awsJson.results) {
      throw new Error('JSON inválido: estrutura "results" não encontrada');
    }

    if (!awsJson.results.audio_segments || !Array.isArray(awsJson.results.audio_segments)) {
      throw new Error('JSON inválido: "results.audio_segments" não encontrado ou não é um array');
    }

    if (awsJson.results.audio_segments.length === 0) {
      throw new Error('JSON inválido: "results.audio_segments" está vazio');
    }

    const fullText = awsJson.results.transcripts?.[0]?.transcript || '';
    
    const segments: TranscriptSegmentDto[] = awsJson.results.audio_segments.map((seg: any) => ({
      startTime: parseFloat(seg.start_time),
      endTime: parseFloat(seg.end_time),
      text: seg.transcript,
    }));

    return {
      language: 'pt-BR',
      fullText,
      segments,
    };
  }

  /**
   * Cria ou atualiza transcrição de um vídeo
   */
  async createOrUpdate(videoId: string, dto: CreateTranscriptDto) {
    // Verifica se o vídeo existe
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      throw new NotFoundException(`Vídeo com ID ${videoId} não encontrado`);
    }

    // Verifica se já existe transcrição
    const existing = await this.prisma.videoTranscript.findUnique({
      where: { videoId },
    });

    if (existing) {
      // Atualiza
      return this.prisma.videoTranscript.update({
        where: { videoId },
        data: {
          language: dto.language || 'pt-BR',
          fullText: dto.fullText,
          segments: dto.segments as any,
        },
      });
    }

    // Cria novo
    return this.prisma.videoTranscript.create({
      data: {
        videoId,
        language: dto.language || 'pt-BR',
        fullText: dto.fullText,
        segments: dto.segments as any,
      },
    });
  }

  /**
   * Cria transcrição a partir de JSON do AWS Transcribe
   */
  async createFromAWS(videoId: string, awsJson: any) {
    try {
      const dto = this.convertAWSTranscript(awsJson);
      return this.createOrUpdate(videoId, dto);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao processar JSON do AWS Transcribe: ${error.message}`);
      }
      throw new Error('Erro desconhecido ao processar JSON do AWS Transcribe');
    }
  }

  /**
   * Busca transcrição de um vídeo
   */
  async findByVideoId(videoId: string) {
    const transcript = await this.prisma.videoTranscript.findUnique({
      where: { videoId },
    });

    if (!transcript) {
      return null;
    }

    return {
      id: transcript.id,
      videoId: transcript.videoId,
      language: transcript.language,
      fullText: transcript.fullText,
      segments: transcript.segments as unknown as TranscriptSegmentDto[],
      createdAt: transcript.createdAt,
      updatedAt: transcript.updatedAt,
    };
  }

  /**
   * Remove transcrição de um vídeo
   */
  async remove(videoId: string) {
    const transcript = await this.prisma.videoTranscript.findUnique({
      where: { videoId },
    });

    if (!transcript) {
      throw new NotFoundException(`Transcrição do vídeo ${videoId} não encontrada`);
    }

    return this.prisma.videoTranscript.delete({
      where: { videoId },
    });
  }

  /**
   * Verifica se um vídeo tem transcrição
   */
  async hasTranscript(videoId: string): Promise<boolean> {
    const count = await this.prisma.videoTranscript.count({
      where: { videoId },
    });
    return count > 0;
  }
}
