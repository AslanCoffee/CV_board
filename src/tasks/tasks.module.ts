import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DocumentsService } from 'src/documents/documents.service';
import { HistoryService } from 'src/history/history.service';
import { WorkGroupService } from 'src/workgroup/workgroup.service';
import { UsersService } from 'src/users/users.service';
@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TasksService, DocumentsService, HistoryService, WorkGroupService, UsersService],
})
export class TasksModule {}
