import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, Min, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MaterialType {
  PDF = 'PDF',
  LINK = 'LINK',
  ARTICLE = 'ARTICLE',
}

export class CreateMaterialDto {
  @ApiProperty({ description: 'Título do material' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Descrição do material' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: MaterialType, description: 'Tipo do material' })
  @IsEnum(MaterialType)
  type: MaterialType;

  @ApiProperty({ description: 'URL do material (arquivo ou link externo)' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ description: 'Tamanho do arquivo em bytes (para PDFs)' })
  @IsInt()
  @Min(0)
  @IsOptional()
  fileSize?: number;

  @ApiPropertyOptional({ description: 'Ordem de exibição' })
  @IsInt()
  @Min(1)
  @IsOptional()
  order?: number;
}
