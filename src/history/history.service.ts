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
}
