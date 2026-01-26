import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  thumbnailVertical?: string;

  @IsString()
  @IsOptional()
  thumbnailHorizontal?: string;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  order: number;
}
