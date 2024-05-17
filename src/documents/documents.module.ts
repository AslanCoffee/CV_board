import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HistoryService } from 'src/history/history.service';
import { WorkGroupService } from 'src/workgroup/workgroup.service';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, HistoryService, WorkGroupService],
})
export class DocumentsModule {}
