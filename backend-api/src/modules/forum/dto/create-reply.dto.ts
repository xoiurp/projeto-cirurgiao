import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @MinLength(10, { message: 'A resposta deve ter no mínimo 10 caracteres' })
  content: string;

  @IsUUID()
  topicId: string;
}
