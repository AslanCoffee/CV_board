import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { Role } from '../role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  department: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}


