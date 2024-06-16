// import { Role } from '@prisma/client';
import { Role } from '../../../node_modules/.prisma/client';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  id?: number;
  
  @IsString()
  name: string;

  @IsString()
  department?: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  role: Role;
}
