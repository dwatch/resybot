import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CheckForNewDayWorker } from './workers/checkForNewDay.worker';
import { WorkerService } from './worker.service';
import { ResyModule } from 'src/resy/resy.module';
import { WorkerController } from './worker.controller';
import { UtilityModule } from 'src/utilities/utility.module';
import { RestaurantsModule } from 'src/entities/restaurant/restaurant.module';
import { ReservationsModule } from 'src/entities/reservation/reservation.module';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'checkForNewDay' }),
    BullModule.registerQueue({ name: 'bookFirstAvailableSlot' }),
    RestaurantsModule,
    ReservationsModule,
    ResyModule,
    BookingModule,
    UtilityModule
  ],
  providers: [
    WorkerService,
    CheckForNewDayWorker
  ],
  exports: [
    WorkerService
  ],
  controllers: [WorkerController]
})
export class WorkerModule {}
