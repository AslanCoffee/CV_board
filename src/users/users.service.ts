import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  static findOne(userId: any) {
    throw new Error('Method not implemented.');
  }

  async remove(id: number) {
    return await this.prismaService.user.delete({
      where: { id: id },
    });
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }
  
  async getByEmail(email: string) {
    const student = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (student) {
      return student;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
    }
    user.password = undefined;
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    let newUser = await this.prismaService.user.create({
      data: createUserDto
    });
    return newUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

}
