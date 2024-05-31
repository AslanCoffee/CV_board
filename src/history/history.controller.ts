import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  async create(@Body() createHistoryDto: CreateHistoryDto) {
    const createdHistory = this.historyService.create(createHistoryDto);
    return createdHistory;
  }

  @Get()
  findAll() {
    return this.historyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoryDto: UpdateHistoryDto) {
    return this.historyService.update(+id, updateHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyService.remove(+id);
  }

  @Get('/task/:taskId')
  async find(@Param('taskId') taskId: string){
    return this.historyService.historyInTask(Number(taskId));
  }

  @Get('/user/:userId')
  async history(@Param('userId') userId: string) {
    return this.historyService.getUserHistory(Number(userId))
  }

  @Get(':id/keywords')
  async getKeywordCounts(@Param('id') id: string) {
    return this.historyService.countKeywordsByDate(Number(id));
  }

  @Get(':id/workgroups/done-tasks')
  async getDoneTaskCount(@Param('id') id: string) {
    return this.historyService.countDoneTasks(Number(id));
  }

  @Get(':id/:options')
  async countCreationsByDate(@Param('id') id: string, @Param('options') options: string) {
    return this.historyService.countCreationsByDate(Number(id), options);
  }
}
