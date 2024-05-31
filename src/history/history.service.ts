import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryService {

  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createHistoryDto: CreateHistoryDto) {
    let newHistory = await this.prismaService.history.create({
      data: createHistoryDto
    });
    return newHistory;
  }

  async findAll() {
    return this.prismaService.history.findMany();
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

  async update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return this.prismaService.history.update({
      where: { id },
      data: updateHistoryDto,
    });
  }

  remove(id: number) {
    return this.prismaService.history.delete({ where: { id } });
  }

  async historyInTask(taskId: number) {
    const workGroup = await this.prismaService.workGroup.findUnique({
      where: { taskId: taskId },
      select: { id: true },
    });

    const history = await this.prismaService.history.findMany({
      where: {
        groupId: workGroup.id,
      },
    });
    return history;
  }

  async getUserHistory(userId: number) {
    const history = await this.prismaService.history.findMany({
      where: {
        userId: userId,
      },
    });
    return history;
  }

  async countKeywordsByDate(userId: number) {
    const histories = await this.prismaService.history.findMany({
      where: {
        userId: userId,
        fieldName: 'редактирование',
      },
      select: {
        oldValue: true,
        updatedAt: true,
      },
    });
  
    const keywords = ['name', 'email', 'statusStage', 'phone', 'urlCV', 'jobTitle', 'srcCV'];
    const keywordCountsByDate = {};
  
    histories.forEach(history => {
      const date = history.updatedAt.toISOString().split('T')[0]; // Получаем только дату без времени
      if (!keywordCountsByDate[date]) {
        keywordCountsByDate[date] = {};
        keywords.forEach(keyword => {
          keywordCountsByDate[date][keyword] = 0;
        });
      }
  
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        const matchCount = (history.oldValue.match(regex) || []).length;
        keywordCountsByDate[date][keyword] += matchCount;
      });
    });
  
    return keywordCountsByDate;
  }

  async countDoneTasks(userId: number) {
    const workGroups = await this.prismaService.workGroup.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        task: true, // Include the task associated with the workgroup
      },
    });

    let doneTaskCount = 0;
    workGroups.forEach(group => {
      if (group.task.statusStage === 'DONE') {
        doneTaskCount += 1;
      }
    });

    return doneTaskCount;
  }

  async countCreationsByDate(userId: number, options: string) {
    const field = this.getStatus(options);
    const histories = await this.prismaService.history.findMany({
      where: {
        userId: userId,
        fieldName: field,
      },
      select: {
        updatedAt: true,
      },
    });

    const countByDate = histories.reduce((acc, history) => {
      const date = history.updatedAt.toISOString().split('T')[0]; // Получаем только дату без времени
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

    return countByDate;
  }

  getStatus(status) {
    switch (status) {
      case 'CREATE':
        return 'Создание';
      case 'GROUP':
        return 'Добавление в группу';
      case 'STATUS':
        return 'Статус';
      case 'DOCUMENT':
        return 'Загрузка';
      default:
        return status; // Вернуть исходное значение, если неизвестный статус
    }
  }
}
