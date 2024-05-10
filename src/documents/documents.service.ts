import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { Document } from '@prisma/client';


@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDocumentDto: CreateDocumentDto) {
    return 'This action adds a new document';
  }

  async uploadDocument(taskId: string, number: string, file: Express.Multer.File): Promise<void> {
    try {
      const uniqueFileName = new Date().getTime() + '_' + file.originalname;
      const uploadDir = 'C:\\Users\\dragm\\Desktop\\proekt\\project\\upload'; // Папка для загрузки файлов
      const filePath = path.join(uploadDir, uniqueFileName);
  
      const fileStream = fs.createWriteStream(filePath);
  
      // Обработка события ошибки записи файла
      fileStream.on('error', (err) => {
        throw new Error(`Failed to write file: ${err.message}`);
      });
      // Обработка события успешной записи файла
      fileStream.on('finish', async () => {
        // Создаем запись о документе и связываем его с задачей
        const document = await this.prisma.document.create({
          data: {
            number,
            url: `\\upload\\${uniqueFileName}`, // Используем путь к файлу в качестве URL
            task: { connect: { id: parseInt(taskId) } }
          }
        });
        console.log(`${uniqueFileName}`);
        return document;
      });
  
      // Записываем данные файла в поток
      fileStream.write(file.buffer);
      fileStream.end();
    } catch (error) {
      throw new Error(`Failed to upload document: ${error.message}`);
    }
  }

  async getUrlsForTask(taskId: string) {
    const documents = await this.prisma.document.findMany({
      where: {
        taskId: parseInt(taskId),
      },
      select: {
        url: true,
      },
    });

    return documents.map((doc: Document) => doc.url);
  }

  findAll() {
    return `This action returns all documents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
