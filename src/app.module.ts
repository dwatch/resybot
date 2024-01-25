import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './entities/user/user.module';
import { PaymentMethodsModule } from './entities/payment-method/payment-method.module';
import { RestaurantsModule } from './entities/restaurant/restaurant.module';
import { ReservationsModule } from './entities/reservation/reservation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'resybot_admin',
      password: 'resybot1Password2',
      database: 'resybot',
      entities: [],
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    PaymentMethodsModule,
    RestaurantsModule,
    ReservationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
