import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserworkService } from './userwork.service';
import { CreateUserworkDto } from './dto/create-userwork.dto';
import { UpdateUserworkDto } from './dto/update-userwork.dto';

@Controller('userwork')
export class UserworkController {
  constructor(private readonly userworkService: UserworkService) {}

  @Post()
  create(@Body() createUserworkDto: CreateUserworkDto) {
    return this.userworkService.create(createUserworkDto);
  }

  @Get()
  findAll() {
    return this.userworkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userworkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserworkDto: UpdateUserworkDto) {
    return this.userworkService.update(+id, updateUserworkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userworkService.remove(+id);
  }
}
