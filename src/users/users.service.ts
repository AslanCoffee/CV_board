import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService){}
  
    async create(createUserDto: CreateUserDto) {
      let newUser = await this.prismaService.user.create({
        data: {
          ...createUserDto
        },
      });
      return newUser;
    }

    async findOne(id: number) {
      return this.prismaService.user.findUnique({ where: { id } });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
      return this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });
    }

    async remove(id: number) {
      return this.prismaService.user.delete({ where: { id } });
    }
}
