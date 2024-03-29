import { Injectable } from '@nestjs/common';
import { CreateActivemarkDto } from './dto/create-activemark.dto';
import { UpdateActivemarkDto } from './dto/update-activemark.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ActivemarkService {
  constructor(private prismaService: PrismaService) {}

  async create(createActivemarkDto: CreateActivemarkDto) {
    let newActivemark = await this.prismaService.activeMark.create({
      data: createActivemarkDto
    });
    return newActivemark;
  }

  findOne(id: number) {
    return `This action returns a #${id} activemark`;
  }

  async update(id: number, updateActivemarkDto: UpdateActivemarkDto) {
    return this.prismaService.activeMark.update({
      where: { id },
      data: updateActivemarkDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.activeMark.delete({ where: { id } });
  }
}
