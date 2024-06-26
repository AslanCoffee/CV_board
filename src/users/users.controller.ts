import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Role } from './role.enum';
import AdminGuards from 'src/guards/users.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(AdminGuards('ADMIN'))
  @Get('/all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.getById(Number(id));
  }
  
  // @UseGuards(AdminGuards('ADMIN'))
  @UseGuards(JwtAuthenticationGuard)
  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const idInt = parseInt(id)
    return this.usersService.update(idInt, updateUserDto);
  }

  // @UseGuards(AdminGuards('ADMIN'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }

  @Get('/find/group/:taskId')
  async findGroup(@Param('taskId') taskId: string){
    return this.usersService.getUsersInWorkGroup(Number(taskId));
  }

  // @UseGuards(AdminGuards('ADMIN'))
  @UseGuards(JwtAuthenticationGuard)
  @Patch('/role')
  async statusChange(
    @Body('id') userId: number,
    @Body('role') newRole: Role,
  ) {
    return this.usersService.roleChange(userId, newRole);
  }

}
