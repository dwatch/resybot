import { Injectable } from '@nestjs/common';
import { hashSync, compareSync } from 'bcrypt';
import { ResybotUserService } from 'src/entities/resybot-user/resybot-user.service';
import { JwtService } from '@nestjs/jwt';
import { ResybotUser } from 'src/entities/resybot-user/resybot-user.entity';
import { ResyClient } from 'src/resy/resy.client';
import { CreateUserDto } from 'src/entities/resybot-user/dto/create-user.dto';
import { PaymentMethodsService } from 'src/entities/payment-method/payment-method.service';
import { CreatePaymentMethodDto } from 'src/entities/payment-method/dto/payment-method.dto';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private resybotUserService: ResybotUserService,
    private paymentMethodsService: PaymentMethodsService,
    private resyClient: ResyClient,
    private jwtService: JwtService
  ) {}

  private readonly SALT_ROUNDS = 10

  async validateUser(email: string, password: string): Promise<ResybotUser | null> {
    const user = await this.resybotUserService.findOneByEmail(email);
    const passwordsMatch: boolean = compareSync(password, user.password)
    if (passwordsMatch) {
      return user
    }
    return null
  }

  async login(user: ResybotUser) {
    const payload: LoginDto = { email: user.email, sub: user.uuid };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
    };
  }

  async signup(email: string, password: string): Promise<ResybotUser> {
    const loginResponse = await this.resyClient.login(email, password)
    const hash = hashSync(password, this.SALT_ROUNDS)
    const createUserDto: CreateUserDto = {
      email: email,
      password: hash,
      firstName: loginResponse.firstName,
      lastName: loginResponse.lastName,
      authToken: loginResponse.token
    }
 
    console.log("Starting to build user")
    const user = await this.resybotUserService.create(createUserDto)
 
    console.log(`User ${user.uuid} has ${loginResponse.paymentMethods.length} payment methods. Saving now`)
    await Promise.all(loginResponse.paymentMethods.map(async (method) => {
      const createPaymentMethodDto: CreatePaymentMethodDto = {
        user: user,
        isDefault: method.is_default,
        lastFourDigits: method.display,
        expiryMonth: method.exp_month,
        expiryYear: method.exp_year,
        resyId: method.id
      }
      const paymentMethod = await this.paymentMethodsService.create(createPaymentMethodDto)
      console.log(`New payment method saved: ${paymentMethod}`)
    }))
    
    console.log("Completed building user")
    return user
  }
}