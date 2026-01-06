import { IsArray, IsString, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class VideoOrderItem {
  @IsString()
  id: string;

  @IsInt()
  order: number;
}

export class ReorderVideosDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoOrderItem)
  videos: VideoOrderItem[];
}
