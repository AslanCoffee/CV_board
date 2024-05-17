import { Controller, Get, Post, Res, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Response } from 'express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';


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

  @Get('download/:id')
  async getImage(@Param('id') id, @Res() res: Response) {
    const subject = await this.documentsService.findOne(Number(id));
    let name = path.basename(subject.url);
    let response: any;
    try {
      //fs.accessSync(subject.url, fs.constants.F_OK); TODO: ВОЗМОЖНО ОШИБКА
      response = res.sendFile(name, { root: './upload' });
    } catch (err) {
      name = 'default.jpg';
      response = res.sendFile(name, { root: './upload' });
    }
    return {
      data: response,
    };
  }

  @Get('download/file/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
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
