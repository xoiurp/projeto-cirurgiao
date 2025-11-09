import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../../shared/enums/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email do usuário' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome completo do usuário' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: 'STUDENT', 
    description: 'Role do usuário',
    enum: Role,
    default: Role.STUDENT,
    required: false
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
