import { Role } from '@prisma/client';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  department?: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
