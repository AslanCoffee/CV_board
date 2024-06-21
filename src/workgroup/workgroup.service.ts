import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkGroupDto } from './dto/create-workgroup.dto';
import { UpdateWorkGroupDto } from './dto/update-workgroup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';


@Injectable()
export class WorkGroupService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(createWorkGroupDto: CreateWorkGroupDto) {
    let newWorkGroup = await this.prismaService.workGroup.create({
      data: {...createWorkGroupDto,
      activeWork: true,
      }
    });
    return newWorkGroup;
  }

  async findGroupId(taskId: number) {
    const workGroup = await this.prismaService.workGroup.findUnique({
      where: { taskId: taskId },
      select: { id: true },
    });
    return workGroup?.id || null;
  }

  async getUsersInWorkGroup(taskId: number) {
    const workGroupId = await this.findGroupId(taskId)
    const workGroup = await this.prismaService.workGroup.findUnique({
      where: { id: workGroupId },
      include: { users: true },
    });

    if (!workGroup) {
      throw new HttpException(
        'Subject with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const lobby = workGroup.users;
    return lobby;
  }

  async findOne(id: number) {
    const subject = await this.prismaService.workGroup.findUnique({
      where: {
        id,
      },
    });
    if (subject) {
      return subject;
    }
    throw new HttpException(
      'Subject with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async update(id: number, updateWorkGroupDto: UpdateWorkGroupDto) {
    return this.prismaService.workGroup.update({
      where: { id },
      data: {
        ...updateWorkGroupDto,
        activeWork: true,
      }
    });
  }

  async remove(id: number) {
    return this.prismaService.workGroup.delete({ where: { id } });
  }

  async addUserToGroup(taskId: number, userId: number) {
    try {
      const group = await this.prismaService.workGroup.findUnique({
        where: { taskId: taskId },
        include: { users: true },
      });
      if (!group) {
        throw new Error(`Work group with ID ${taskId} not found`);
      }
      const userExistsInGroup = group.users.some((user) => user.id === userId);
      if (userExistsInGroup) {
        throw new Error(`User with ID ${userId} is already in the group`);
      }

      const groupId = await this.prismaService.workGroup.findUnique({
        where: { taskId: taskId, },
      });
      await this.prismaService.workGroup.update({
        where: { id: groupId.id },
        data: {
          users: {
            connect: [{ id: userId }],
          },
        },
      });
    await this.prismaService.history.create({
      data: {
        userId: userId,
        groupId: groupId.id,
        fieldName: "Добавление в группу",
        oldValue: "",
        newValue: "",
      }
    })
    } catch (error) {
      throw new Error(`Failed to add user to group: ${error.message}`);
    }
  }

  async findAll() {
    return this.prismaService.workGroup.findMany();
  }

  async getById(id: number) {
    const workGroup = await this.prismaService.workGroup.findUnique({
      where: {
        taskId: id,
      },
    });
    if (!workGroup) {
      throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
    }
    return workGroup;
  }

}
