import { IsString, IsOptional, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TranscriptSegmentDto {
  @ApiProperty({ description: 'Tempo de início do segmento em segundos', example: 0 })
  startTime: number;

  @ApiProperty({ description: 'Tempo de fim do segmento em segundos', example: 22.79 })
  endTime: number;

  @ApiProperty({ description: 'Texto do segmento', example: 'existem dois tipos de acesso cirúrgico...' })
  text: string;
}

export class CreateTranscriptDto {
  @ApiPropertyOptional({ description: 'Idioma da transcrição', example: 'pt-BR', default: 'pt-BR' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ description: 'Texto completo da transcrição' })
  @IsString()
  @IsOptional()
  fullText?: string;

  @ApiProperty({ 
    description: 'Segmentos da transcrição com timestamps',
    type: [TranscriptSegmentDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranscriptSegmentDto)
  segments: TranscriptSegmentDto[];
}

// DTO para upload de arquivo AWS Transcribe
// Não aplicamos validação estrita pois o formato pode variar
export class UploadAWSTranscriptDto {
  @ApiProperty({ description: 'JSON do AWS Transcribe', type: 'object' })
  @IsObject()
  awsTranscriptJson: any; // Aceita qualquer estrutura JSON
}
