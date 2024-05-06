import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './requestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import JwtAuthenticationGuard from './jwt-authentication.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthService) {}
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }


@HttpCode(200)
@UseGuards(LocalAuthenticationGuard)
@Post('log-in')
async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
  const { user } = request
  const cookie = this.authenticationService.getCookieWithJwtToken(user.id)
  request.res.set('Set-Cookie', cookie)
  user.password = undefined
  return request.res.send(user)
}



@UseGuards(JwtAuthenticationGuard)
@Post('log-out')
async logOut   (@Req()request:RequestWithUser,@Res() response: Response) {
  response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
  return response.sendStatus(200);
}


@UseGuards(JwtAuthenticationGuard)
@Get()
authenticate(@Req() request: RequestWithUser) {
  const user = request.user;
  user.password = undefined;
  return user;
}
}