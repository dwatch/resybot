import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { RestaurantsModule } from 'src/entities/restaurant/restaurant.module';
import { ReservationsModule } from 'src/entities/reservation/reservation.module';
import { ResyModule } from 'src/resy/resy.module';
import { UtilityModule } from 'src/utilities/utility.module';

@Module({
  imports: [UtilityModule, ResyModule, RestaurantsModule, ReservationsModule],
  providers: [BookingService],
  controllers: [BookingController]
})
export class BookingModule {}
