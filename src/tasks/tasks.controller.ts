import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors, 
  UploadedFiles,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard'; // Пример guard'а для JWT-аутентификации
import AuthMiddleware from 'src/guards/tasks.guard'; // Ваш middleware для авторизации
import { Status } from './status.enum';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const createdTask = await this.tasksService.create(createTaskDto);
    return createdTask;
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    return this.tasksService.uploadFile(file);
  }

  @Get('/all')
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async taskData() {
    return this.tasksService.taskData();
  }

  @Patch('/status')
  async statusChange(
    @Body('id') taskid: number,
    @Body('statusStage') newStatus: Status,
  ) {
    return this.tasksService.statuschange(taskid, newStatus);
  }

  @Patch('/update/:id')
  async update(@Body('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard, AuthMiddleware) // Применяем guard для JWT-аутентификации
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
