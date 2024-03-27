import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService){}
  
  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto)
    const newUser = await this.prismaService.user.create({
      data: createUserDto,
    })
    return newUser
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} task`;
  }

  async updateNickname(id: number, newNickname: string) {
    return await this.prismaService.user.update({
      where: { id: id },
      data: { name: newNickname }
    });
  }

  remove(id: number) {
    return `Пользователь с id ${id} удалён`;
  }
}
