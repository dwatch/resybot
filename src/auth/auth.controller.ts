import { Controller, Post, Put, Body, UnauthorizedException, Session } from '@nestjs/common';
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
  async login(@Session() session, @Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    session.authToken = user.authToken
    session.userUuid = user.uuid
    return this.authService.createJwtToken(user);
  }

  @Public()
  @Put('signup')
  async signup(@Body() body: SignupDto): Promise<ReturnJwtTokenDto> {
    const user = await this.authService.signup(body.email, body.password)
    return this.authService.createJwtToken(user)
  }
}