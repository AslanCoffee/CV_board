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
  UseGuards,
  Req
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import AuthMiddleware from 'src/guards/tasks.guard';
import { Status } from './status.enum';
import { DocumentsService } from 'src/documents/documents.service';
import RequestWithUser from 'src/auth/requestWithUser.interface';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly documentsService: DocumentsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async create(@Body() requestBody: any, @Req() request: RequestWithUser) {
    const createdTask = await this.tasksService.create(requestBody, request.user.id);
    return createdTask;
  }
  
  @Post('/documents')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthenticationGuard)
  async attachDocumentToTask(
    @Body() requestBody: { taskId: string, number: string },
    @UploadedFile() file: Express.Multer.File,
    @Req() request: RequestWithUser
  ): Promise<void> {
    const { taskId, number } = requestBody;
    const document = await this.documentsService.uploadDocument(taskId, number, file, request.user.id);
    return document;
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
  @UseGuards(JwtAuthenticationGuard)
  async statusChange(
    @Body('id') taskid: number,
    @Body('statusStage') newStatus: Status,
    @Req() request: RequestWithUser
  ) {
    return this.tasksService.statuschange(taskid, newStatus, request.user.id);
  }
  
  @Patch('/update/:id')
  @UseGuards(JwtAuthenticationGuard)
  async update(@Body('id') id: number, @Body() updateTaskDto: UpdateTaskDto, @Req() request: RequestWithUser) {
    return this.tasksService.updateAndHistory(id, updateTaskDto, request.user.id);
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard, AuthMiddleware)
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
