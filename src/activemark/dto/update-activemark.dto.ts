import { PartialType } from '@nestjs/mapped-types';
import { CreateActivemarkDto } from './create-activemark.dto';

export class UpdateActivemarkDto extends PartialType(CreateActivemarkDto) {}
