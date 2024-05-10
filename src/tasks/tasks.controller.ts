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
import { DocumentsService } from 'src/documents/documents.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly documentsService: DocumentsService
  ) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {// надо сделать авто workgroup и авто history
    const createdTask = await this.tasksService.create(createTaskDto);
    return createdTask;
  }
  
  @Post('/documents')
  @UseInterceptors(FileInterceptor('file')) // Обработка загружаемого файла
  async attachDocumentToTask(
    @Body() requestBody: { taskId: string, number: string }, // Предполагается, что вы передаете taskId и number в теле запроса
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const { taskId, number } = requestBody;
    const document = await this.documentsService.uploadDocument(taskId, number, file);
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
  
  @Patch('/status')// авто history
  async statusChange(
    @Body('id') taskid: number,
    @Body('statusStage') newStatus: Status,
  ) {
    return this.tasksService.statuschange(taskid, newStatus);
  }
  
  @Patch('/update/:id')// авто history
  async update(@Body('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard, AuthMiddleware)
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
  //   @Post('/upload')
  //   @UseInterceptors(FileInterceptor('file'))// авто history
  // async uploadFile(@UploadedFile() file/*: Express.Multer.File*/) {
  //     return this.tasksService.uploadFile(file);
  //   }
  
    // @Post(':taskId/documents')
    // @UseInterceptors(FileInterceptor('file')) // Обработка загружаемого файла
    // async attachDocumentToTask(
    //   @Param('taskId') taskId: number,
    //   @UploadedFile() file: Express.Multer.File,
    //   @Body() documentData: { number: string } // Предполагается, что вы передаете только номер документа в теле запроса
    // ): Promise<void> {
    //   const { number } = documentData;
    //   await this.tasksService.attachDocumentToTask(taskId, number, file);
    // }
}
