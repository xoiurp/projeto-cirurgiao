import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsBoolean, IsOptional, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, minLength: 6 })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, enum: Role })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
