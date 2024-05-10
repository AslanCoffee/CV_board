import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from './status.enum';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const newTask = await this.prismaService.task.create({
      data: {
        ...createTaskDto,
      },
    });
    return newTask;
  }

  // async uploadFile(file) {
  //   try {
  //     const uniqueFileName = new Date().getTime() + '_' + file.originalname;
  //     const filePath = path.join('C:\\Users\\dragm\\Desktop\\proekt\\project\\upload', uniqueFileName);
      
  //     const fileStream = fs.createWriteStream(filePath);
      
  //     fileStream.write(file.buffer);
  //     fileStream.end();
      
  //     return { filePath };
  //   } catch (error) {
  //     console.error('Ошибка при сохранении файла:', error);
  //     throw error;
  // }


  // async attachDocumentToTask(taskId: number, number: string, file: Express.Multer.File): Promise<void> {
  //   try {
  //     const task = await this.prismaService.task.findUnique({ where: { id: taskId } });
  //     if (!task) {
  //       throw new Error(`Task with ID ${taskId} not found`);
  //     }

  //     const uploadDir = 'uploads';
  //     const filePath = path.join(__dirname, '..', '..', uploadDir, file.originalname);
  //     fs.writeFileSync(filePath, file.buffer);

  //     await this.prismaService.document.create({
  //       data: {
  //         number,
  //         url: filePath,
  //         task: { connect: { id: taskId } }
  //       }
  //     });
  //   } catch (error) {
  //     throw new Error(`Failed to attach document to task: ${error.message}`);
  //   }
  // }

  async findAll() {
    return this.prismaService.task.findMany();
  }

  async statuschange(taskId: number, newStatus: Status) {
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

  remove(id: number) {
    return this.prismaService.task.delete({ where: { id } });
  }
}
