import { Controller, Get, Req, Post, Body, Patch, Res, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import RequestWithUser from './requestWithUser.interface';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('log-in/:id')
  // async logIn(@Param('id') id: string, @Req() request: RequestWithUser, @Res() response: Response) {
  //   const { user } = request
  //   const cookie = await this.authService.getCookieWithJwtToken(+id)
  //   request.res.set('Set-Cookie', cookie)
  //   return request.res.send(user)
  // }

  @Post('log-out')
  logOut(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

}
