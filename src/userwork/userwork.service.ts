import { Injectable } from '@nestjs/common';
import { CreateUserworkDto } from './dto/create-userwork.dto';
import { UpdateUserworkDto } from './dto/update-userwork.dto';

@Injectable()
export class UserworkService {
  create(createUserworkDto: CreateUserworkDto) {
    return 'This action adds a new userwork';
  }

  findAll() {
    return `This action returns all userwork`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userwork`;
  }

  update(id: number, updateUserworkDto: UpdateUserworkDto) {
    return `This action updates a #${id} userwork`;
  }

  remove(id: number) {
    return `This action removes a #${id} userwork`;
  }
}
