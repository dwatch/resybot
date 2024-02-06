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
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { BookingModule } from './booking/booking.module';
import { typeOrmModuleDetails } from './ormconfig'
import { UtilityModule } from './utilities/utility.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmModuleDetails),
    UtilityModule,
    ResybotUserModule,
    PaymentMethodsModule,
    RestaurantsModule,
    ReservationsModule,
    ResyModule,
    AuthModule,
    BookingModule
  ],
  controllers: [AppController],
  providers: [AppService, {provide: APP_GUARD, useClass: JwtAuthGuard}]
})
export class AppModule {}
 