import { Module } from '@nestjs/common';
import { WorkGroupService } from './workgroup.service';
import { WorkGroupController } from './workgroup.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HistoryService } from 'src/history/history.service';

@Module({
  imports: [PrismaModule],
  controllers: [WorkGroupController],
  providers: [WorkGroupService, HistoryService],
})
export class WorkGroupModule {}
