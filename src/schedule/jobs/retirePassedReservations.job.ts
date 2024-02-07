import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RetirePassedReservationsJob {
  private readonly logger = new Logger(RetirePassedReservationsJob.name);

  @Cron('0 45 23 * * *', { timeZone: 'America/New_York' })
  run() {
    
  }
}
