import { Module } from '@nestjs/common';
import { RetirePassedReservationsJob } from './jobs/retirePassedReservations.job';
import { SearchForAvailableSlotsJob } from './jobs/searchForAvailableSlots.job';
import { ResybotUserModule } from 'src/entities/resybot-user/resybot-user.module';
import { ResyModule } from 'src/resy/resy.module';
import { ReservationsModule } from 'src/entities/reservation/reservation.module';
import { WorkerModule } from 'src/worker/worker.module';
import { RestaurantsModule } from 'src/entities/restaurant/restaurant.module';
import { UtilityModule } from 'src/utilities/utility.module';

@Module({
  imports: [
    ResybotUserModule,
    RestaurantsModule,
    ReservationsModule,
    ResyModule,
    WorkerModule,
    UtilityModule
  ],
  providers: [
    RetirePassedReservationsJob,
    SearchForAvailableSlotsJob
  ]
})
export class CronModule {}
