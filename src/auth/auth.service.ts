import { Injectable } from '@nestjs/common';
import { ResybotUserService } from 'src/entities/resybot-user/resybot-user.service';
import { JwtService } from '@nestjs/jwt';
import { ResybotUser } from 'src/entities/resybot-user/resybot-user.entity';

@Injectable()
export class AuthService {
  constructor(
    private resybotUserService: ResybotUserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.resybotUserService.findOneByEmail(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: ResybotUser) {
    const payload = { email: user.email, sub: user.uuid };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
    };
  }
}