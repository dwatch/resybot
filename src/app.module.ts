import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ResybotUserModule } from './entities/resybot-user/resybot-user.module'
import { PaymentMethodsModule } from './entities/payment-method/payment-method.module'
import { RestaurantsModule } from './entities/restaurant/restaurant.module'
import { ReservationsModule } from './entities/reservation/reservation.module'
import { ResyModule } from './resy/resy.module'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'resybot',
      entities: [],
      autoLoadEntities: true,
      synchronize: false
    }),
    ResybotUserModule,
    PaymentMethodsModule,
    RestaurantsModule,
    ReservationsModule,
    ResyModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
