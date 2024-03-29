import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from './status.enum';

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService){}
  
  async create(createTaskDto: CreateTaskDto) {
    let newTask = await this.prismaService.task.create({
      data: {
        ...createTaskDto
      },
    });
    return newTask;
  }

  async statuschange(taskId: number, newStatus: Status){
    return this.prismaService.task.update({
      where: { id: taskId },
      data: { statusStage: newStatus },
    });
  }

  async findOne(id: number) {
    return this.prismaService.task.findUnique({ where: { id } });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.prismaService.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  remove(id: number) {
    return this.prismaService.task.delete({ where: { id } });
  }
}
