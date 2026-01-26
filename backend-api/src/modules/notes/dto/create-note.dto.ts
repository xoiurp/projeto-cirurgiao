import { IsString, IsOptional, IsInt, Min, MaxLength, MinLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @MinLength(1, { message: 'O conteúdo da nota não pode estar vazio' })
  @MaxLength(5000, { message: 'O conteúdo da nota não pode ter mais de 5000 caracteres' })
  content: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'O timestamp deve ser maior ou igual a 0' })
  timestamp?: number;
}
