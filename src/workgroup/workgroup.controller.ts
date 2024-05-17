import { Controller, Req, Get, Post, Body, Patch, Param, Delete, Catch, UseGuards } from '@nestjs/common';
import { WorkGroupService } from './workgroup.service';
import { CreateWorkGroupDto } from './dto/create-workgroup.dto';
import { UpdateWorkGroupDto } from './dto/update-workgroup.dto';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';

@Controller('workgroup')
export class WorkGroupController {
  constructor(private readonly workGroupService: WorkGroupService) {}

  @Post()
  async create(@Body() createWorkGroupDto: CreateWorkGroupDto) {
    return await this.workGroupService.create(createWorkGroupDto);
  }

  @Post('/add-user')
  @UseGuards(JwtAuthenticationGuard)
  async addUserToGroup(@Body('taskId') taskId: number, @Req() request: RequestWithUser) {
    await this.workGroupService.addUserToGroup(taskId, request.user.id);
  }

  @Get(':id')//по taskId ищет
  async findOne(@Param('id') id: string) {
    return await this.workGroupService.getById(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkGroupDto: UpdateWorkGroupDto) {
    return this.workGroupService.update(+id, updateWorkGroupDto);
  }

  @Get('/find/:taskId')
  async find(@Param('taskId') taskId: string){
    return this.workGroupService.getUsersInWorkGroup(Number(taskId));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workGroupService.remove(+id);
  }

  @Get('/all')
  async findAll() {
    return this.workGroupService.findAll();
  }
}
