import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { ResybotUserModule } from 'src/entities/resybot-user/resybot-user.module';
import { RestaurantsModule } from 'src/entities/restaurant/restaurant.module';
import { ReservationsModule } from 'src/entities/reservation/reservation.module';

@Module({
  imports: [ResybotUserModule, RestaurantsModule, ReservationsModule],
  providers: [BookingService],
  controllers: [BookingController]
})
export class BookingModule {}
