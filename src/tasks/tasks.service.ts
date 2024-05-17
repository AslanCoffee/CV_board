import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from './status.enum';
import * as fs from 'fs';
import * as path from 'path';
import { HistoryService } from 'src/history/history.service';
import { WorkGroupService } from 'src/workgroup/workgroup.service';
import RequestWithUser from 'src/auth/requestWithUser.interface';

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly historyService: HistoryService,
    private readonly workGroupService: WorkGroupService
  ) {}

  async create(requestBody: any, userId: number) {
    const { name, email, phone, jobTitle, description } = requestBody;
    const newTask = await this.prismaService.task.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        jobTitle: jobTitle,
        description: description,
        statusStage: 'CREATE'
      },
    });
    const res = await this.workGroupService.create({
      taskId: newTask.id,
      activeWork: true
    });
    await this.historyService.create({
      userId: userId,
      groupId: res.id,
      fieldName: "Создание", 
      oldValue: "",
      newValue: "",
    });
    await this.workGroupService.addUserToGroup(newTask.id, userId)
    return newTask;
  }

  async findAll() {
    return this.prismaService.task.findMany();
  }

  async statuschange(taskId: number, newStatus: Status, userId: number) {
    const workGroupId = await this.workGroupService.findGroupId(taskId);

    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
      select: { statusStage: true },
    });
    const oldValue = task.statusStage;
    await this.historyService.create({
      userId: userId,
      groupId: workGroupId,
      fieldName: "Статус",
      oldValue: oldValue,
      newValue: newStatus,
    });

    if(newStatus === "DONE") {
      await this.prismaService.workGroup.update({
        where: { id: workGroupId},
        data: {
          doneDate: new Date(),
          activeWork: false,
         },
      })
    }

    if(newStatus === "DELETED") {
      await this.prismaService.workGroup.update({
        where: { id: workGroupId},
        data: {
          deleteDate: new Date(),
          activeWork: false,
        },
      })
    }

    return this.prismaService.task.update({
      where: { id: taskId },
      data: { statusStage: newStatus },
    });
  }

  async taskData() {
    return this.prismaService.task.findFirst();
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.prismaService.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async findOne(id: number) {
    const subject = await this.prismaService.history.findUnique({
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

  async updateAndHistory(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const taskBeforeUpdate = await this.prismaService.task.findUnique({
      where: {
        id,
      },
    });
    const updatedTask = await this.prismaService.task.update({
      where: { id },
      data: updateTaskDto
    });

    const differences = this.findDifferences(taskBeforeUpdate, updatedTask)

    let oldValue = '';
    let newValue = '';

    if ((await differences).length === 0) {
    } else {
      (await differences).forEach((field) => {
        oldValue = field + ' ' + taskBeforeUpdate[field] + ' ' + oldValue;
        newValue = field + ' ' + updatedTask[field] + ' ' + newValue;
      });
    }
    
    const groupId = await this.workGroupService.findGroupId(id);

    if(oldValue !== newValue)
    {
    await this.historyService.create({
      userId: userId,
      groupId: groupId,
      fieldName: "редактирование",
      oldValue: oldValue,
      newValue: newValue,
    });
  }

    return updatedTask;
  }

  async findDifferences(taskBeforeUpdate: any, updatedTask: any) {
    const differences: string[] = [];
  
    for (const key in taskBeforeUpdate) {
      if (taskBeforeUpdate.hasOwnProperty(key)) {
        if (taskBeforeUpdate[key] !== updatedTask[key]) {
          differences.push(key); 
        }
      }
    }
  
    return differences;
  }

  remove(id: number) {
    return this.prismaService.task.delete({ where: { id } });
  }
}
