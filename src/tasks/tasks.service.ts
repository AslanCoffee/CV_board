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

  async uploadFile(file) {
    try {
      // Генерируем уникальное имя файла
      const uniqueFileName = new Date().getTime() + '_' + file.originalname;
      // Указываем путь к папке, где хотим сохранить файл
      const filePath = path.join('C:\\Users\\dragm\\Desktop\\proekt\\project\\upload', uniqueFileName);
      
      // Создаем поток для записи файла
      const fileStream = fs.createWriteStream(filePath);
      
      // Записываем файл в поток
      fileStream.write(file.buffer);
      fileStream.end();
      
      // Возвращаем путь к сохраненному файлу
      return { filePath };
    } catch (error) {
      console.error('Ошибка при сохранении файла:', error);
      throw error;
    } // Действия с загруженным файлом (например, сохранение его пути в базе данных)
  }

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
