import { Controller, Post, Put, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { SignupDto } from './dto/signup.dto';
import { ReturnJwtTokenDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.createJwtToken(user);
  }

  @Public()
  @Put('signup')
  async signup(@Body() body: SignupDto): Promise<ReturnJwtTokenDto> {
    const user = await this.authService.signup(body.email, body.password)
    return this.authService.createJwtToken(user)
  }
}