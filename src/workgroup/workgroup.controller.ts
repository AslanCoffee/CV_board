import { Controller, Req, Get, Post, Body, Patch, Param, Delete, Catch } from '@nestjs/common';
import { WorkGroupService } from './workgroup.service';
import { CreateWorkGroupDto } from './dto/create-workgroup.dto';
import { UpdateWorkGroupDto } from './dto/update-workgroup.dto';
import RequestWithUser from 'src/auth/requestWithUser.interface';

@Controller('workgroup')
export class WorkGroupController {
  constructor(private readonly workGroupService: WorkGroupService) {}

  @Post()
  async create(@Body() createWorkGroupDto: CreateWorkGroupDto) {
    return await this.workGroupService.create(createWorkGroupDto);
  }

  // @Post('/add-user')
  // async addUserToGroup(@Body() requestBody: { groupId: number, userId: number }) {
  //   const { groupId, userId } = requestBody;
  //   await this.workGroupService.addUserToGroup(groupId, userId);
  // }

  @Post('/add-user')
  async addUserToGroup(@Body() groupId: number, @Req() request: RequestWithUser) {
    await this.workGroupService.addUserToGroup(groupId, request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workGroupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkGroupDto: UpdateWorkGroupDto) {
    return this.workGroupService.update(+id, updateWorkGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workGroupService.remove(+id);
  }
}
