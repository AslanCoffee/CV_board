import { Module } from '@nestjs/common';
import { WorkGroupService } from './workgroup.service';
import { WorkGroupController } from './workgroup.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [PrismaModule],
  controllers: [WorkGroupController],
  providers: [WorkGroupService, UsersService],
})
export class WorkGroupModule {}
