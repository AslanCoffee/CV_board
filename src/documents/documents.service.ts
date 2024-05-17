import { Injectable, HttpException, HttpStatus  } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { Document } from '@prisma/client';
import { HistoryService } from 'src/history/history.service';
import { WorkGroupService } from 'src/workgroup/workgroup.service';


@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly historyService: HistoryService,
    private readonly workGroupService: WorkGroupService
  ) {}

  create(createDocumentDto: CreateDocumentDto) {
    return 'This action adds a new document';
  }

  async uploadDocument(taskId: string, number: string, file: Express.Multer.File, userId: number): Promise<void> {
    try {
      const uniqueFileName = new Date().getTime() + '_' + file.originalname;
      const uploadDir = 'upload'; 
      const filePath = path.join(uploadDir, uniqueFileName);
  
      const fileStream = fs.createWriteStream(filePath);
  
      fileStream.on('error', (err) => {
        throw new Error(`Failed to write file: ${err.message}`);
      });
      fileStream.on('finish', async () => {
        const document = await this.prisma.document.create({
          data: {
            number,
            url: `${uniqueFileName}`, 
            task: { connect: { id: parseInt(taskId) } }
          }
        });
        return document;
      });
  
      fileStream.write(file.buffer);
      fileStream.end();

      const workGroupId = await this.workGroupService.findGroupId(Number(taskId));

      await this.historyService.create({
        userId: userId,
        groupId: workGroupId,
        fieldName: "Загрузка",
        oldValue: "",
        newValue: file.originalname,
      });

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
        id: true,
        url: true,
      },
    });
    return documents.map((doc: Document) => ({ id: doc.id, url: doc.url }));
  }

  async getFile(filename: string) {
    const uploadDir = 'upload'; // Папка, где хранятся загруженные файлы
    const filePath = path.join(uploadDir, filename);
    return {
      path: filePath,
      originalname: filename,
    };
  }

  findAll() {
    return `This action returns all documents`;
  }

  async findOne(id: number) {
    const subject = await this.prisma.document.findUnique({
      where: {
        id,
      },
    });
    if (subject) {
      return subject;
    }
    throw new HttpException(
      'Subject with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
