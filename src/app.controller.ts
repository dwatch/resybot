import { Controller, Request, Post, UseGuards, Put, Body } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/decorator/public.decorator';
import { UserAuthDto } from './auth/dto/auth.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Put('auth/signup')
  async signup(@Body() body: UserAuthDto) {
    const user = await this.authService.signup(body.email, body.password)
    return this.authService.login(user)
  }
}