import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ActivemarkModule } from './activemark/activemark.module';
import { UserworkModule } from './userwork/userwork.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, TasksModule, ActivemarkModule, UserworkModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
