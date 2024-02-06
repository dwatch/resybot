import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ResybotUserModule } from 'src/entities/resybot-user/resybot-user.module';
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy';
import { ResyModule } from 'src/resy/resy.module';
import { PaymentMethodsModule } from 'src/entities/payment-method/payment-method.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ResybotUserModule,
    ResyModule,
    PaymentMethodsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy
  ],
  exports: [AuthService]
})
export class AuthModule {}