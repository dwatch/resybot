import { Controller, Request, Post, UseGuards, Put, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthGuard } from './local-auth.guard';
import { Public } from './decorator/public.decorator';
import { SignupDto } from './dto/signup.dto';
import { CreateJwtTokenResponse } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(SignInAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.createJwtToken(req.user);
  }

  @Public()
  @Put('signup')
  async signup(@Body() body: SignupDto): Promise<CreateJwtTokenResponse> {
    const user = await this.authService.signup(body.email, body.password)
    return this.authService.createJwtToken(user)
  }
}