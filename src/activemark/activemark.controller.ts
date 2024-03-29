import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActivemarkService } from './activemark.service';
import { CreateActivemarkDto } from './dto/create-activemark.dto';
import { UpdateActivemarkDto } from './dto/update-activemark.dto';

@Controller('activemark')
export class ActivemarkController {
  constructor(private readonly activemarkService: ActivemarkService) {}

  @Post()
  async create(@Body() createActivemarkDto: CreateActivemarkDto) {
    return await this.activemarkService.create(createActivemarkDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activemarkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivemarkDto: UpdateActivemarkDto) {
    return this.activemarkService.update(+id, updateActivemarkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activemarkService.remove(+id);
  }
}
