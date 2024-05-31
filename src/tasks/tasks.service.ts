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
    const { name, email, phone, jobTitle, description, urlCV, srcCV } = requestBody;
    const newTask = await this.prismaService.task.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        jobTitle: jobTitle,
        description: description,
        statusStage: 'CREATE',
        urlCV: urlCV,
        srcCV: srcCV,
        createDate: this.formatDate(),
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
    } else if(newStatus === "DELETED") {
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

  formatDate() {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
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

  async remove(id: number) {
    // Удаление всех записей History, связанных с задачей
    await this.prismaService.history.deleteMany({
      where: {
        groupId: {
          in: (await this.prismaService.workGroup.findMany({
            where: { taskId: id },
            select: { id: true },
          })).map(group => group.id),
        },
      },
    });

    // Удаление связанной WorkGroup
    await this.prismaService.workGroup.deleteMany({
      where: { taskId: id },
    });

    // Удаление самой задачи
    return this.prismaService.task.delete({
      where: { id },
    });
  }


  async findUserWorkGroupsTasks(userId: number) {
    const workGroups = await this.prismaService.workGroup.findMany({
      where: {
        users: {
          some: {
            id: userId
          }
        }
      },
      include: {
        task: true
      }
    });

    const tasks = workGroups.map(group => group.task);

    return tasks;
  }

  async findUserCreatedTasks(userId: number) {
    const histories = await this.prismaService.history.findMany({
      where: {
        userId: userId,
        fieldName: "Создание"
      },
      include: {
        group: {
          include: {
            task: true
          }
        }
      }
    });

    const tasks = histories.map(history => history.group.task);


    return tasks;
  }

}
