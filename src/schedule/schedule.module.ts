import { Module } from '@nestjs/common';
import { RetirePassedReservationsJob } from './jobs/retirePassedReservations.job';
import { SearchForAvailableSlotsJob } from './jobs/searchForAvailableSlots.job';
import { ResybotUserModule } from 'src/entities/resybot-user/resybot-user.module';
import { ResyModule } from 'src/resy/resy.module';

@Module({
  imports: [
    ResybotUserModule,
    ResyModule
  ],
  providers: [
    RetirePassedReservationsJob,
    SearchForAvailableSlotsJob
  ]
})
export class ScheduleModule {}
