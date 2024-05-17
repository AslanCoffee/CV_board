import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WorkGroupService } from 'src/workgroup/workgroup.service';
import { HistoryService } from 'src/history/history.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, WorkGroupService, HistoryService],
  exports: [UsersService]
})
export class UsersModule {}
