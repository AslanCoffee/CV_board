import { Controller, Get, Post, Res, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Response } from 'express';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto);
  }

  @Get('task/:taskId')
  async getDocumentsForTask(@Param('taskId') taskId: string) {
    try {
      return await this.documentsService.getUrlsForTask(taskId);
    } catch (error) {
      console.error('Ошибка при получении документов для задачи:', error);
      throw new Error('Ошибка сервера');
    }
  }

  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      console.log(res);
      const file = await this.documentsService.getFile(filename); 
      res.download(file.path, file.originalname); 
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      res.status(500).send('Ошибка сервера');
    }
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }
}
