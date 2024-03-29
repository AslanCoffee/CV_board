import { PartialType } from '@nestjs/mapped-types';
import { CreateUserworkDto } from './create-userwork.dto';

export class UpdateUserworkDto extends PartialType(CreateUserworkDto) {}
