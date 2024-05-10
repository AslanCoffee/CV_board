import { Injectable } from '@nestjs/common';
import { CreateWorkGroupDto } from './dto/create-workgroup.dto';
import { UpdateWorkGroupDto } from './dto/update-workgroup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';


@Injectable()
export class WorkGroupService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}

  async create(createWorkGroupDto: CreateWorkGroupDto) {
    let newWorkGroup = await this.prismaService.workGroup.create({
      data: createWorkGroupDto
    });
    return newWorkGroup;
  }

  findOne(id: number) {
    return `This action returns a #${id} workgroup`;
  }

  async update(id: number, updateWorkGroupDto: UpdateWorkGroupDto) {
    return this.prismaService.workGroup.update({
      where: { id },
      data: updateWorkGroupDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.workGroup.delete({ where: { id } });
  }

  async addUserToGroup(groupId: number, request: RequestWithUser) {//мб лучше по taskId
    try {
      const response = request.user as CreateUserDto;
      let userId = response.id;
      const group = await this.prismaService.workGroup.findUnique({
        where: { id: groupId },
        include: { users: true },
      });

      if (!group) {
        throw new Error(`Work group with ID ${groupId} not found`);
      }

      const userExistsInGroup = group.users.some((user) => user.id === userId);
      if (userExistsInGroup) {
        throw new Error(`User with ID ${userId} is already in the group`);
      }

      const user = await this.usersService.getById(userId);

      await this.prismaService.workGroup.update({
        where: { id: groupId },
        data: {
          users: {
            connect: [{ id: userId }],
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to add user to group: ${error.message}`);
    }
  }

}
