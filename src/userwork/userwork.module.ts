import { Module } from '@nestjs/common';
import { UserworkService } from './userwork.service';
import { UserworkController } from './userwork.controller';

@Module({
  controllers: [UserworkController],
  providers: [UserworkService],
})
export class UserworkModule {}
