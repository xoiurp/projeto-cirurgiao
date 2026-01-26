import { IsString, IsUUID, IsOptional, MinLength } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @MinLength(5, { message: 'O título deve ter no mínimo 5 caracteres' })
  title: string;

  @IsString()
  @MinLength(10, { message: 'O conteúdo deve ter no mínimo 10 caracteres' })
  content: string;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  @IsOptional()
  videoId?: string;
}
