import { Module } from '@nestjs/common';
import { ActivemarkService } from './activemark.service';
import { ActivemarkController } from './activemark.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ActivemarkController],
  providers: [ActivemarkService],
})
export class ActivemarkModule {}
