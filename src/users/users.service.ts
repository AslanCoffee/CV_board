import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WorkGroupService } from 'src/workgroup/workgroup.service';
import { Role } from './role.enum';
import { HistoryService } from 'src/history/history.service';

@Injectable()
export class UsersService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly workGroupService: WorkGroupService,
    private readonly historyService: HistoryService
  ) { }

  async remove(id: number) {
    // Удаление всех записей History, связанных с пользователем
    await this.prismaService.history.deleteMany({
      where: {
        userId: id,
      },
    });

    // Удаление пользователя из всех групп WorkGroup
    const userGroups = await this.prismaService.workGroup.findMany({
      where: {
        users: {
          some: {
            id: id,
          },
        },
      },
    });

    for (const group of userGroups) {
      await this.prismaService.workGroup.update({
        where: {
          id: group.id,
        },
        data: {
          users: {
            disconnect: {
              id: id,
            },
          },
        },
      });
    }

    // Удаление пользователя
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

  async getUsersInWorkGroup(taskId: number) {
    const workGroupId = await this.workGroupService.findGroupId(taskId);
    const users = await this.prismaService.user.findMany({
      where: {
        group: {
          some: {
            id: workGroupId,
          },
        },
      },
    });
    return users;
  }

  async roleChange(userId: number, newRole: Role) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  }

}
