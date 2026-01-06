import { IsArray, IsString, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ModuleOrderItem {
  @IsString()
  id: string;

  @IsInt()
  order: number;
}

export class ReorderModulesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleOrderItem)
  modules: ModuleOrderItem[];
}
