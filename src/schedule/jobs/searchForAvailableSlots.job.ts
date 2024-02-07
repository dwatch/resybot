import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SearchForAvailableSlotsJob {
  private readonly logger = new Logger(SearchForAvailableSlotsJob.name);

  @Cron('0 45 23 * * *', { timeZone: 'America/New_York' })
  run() {
    
  }
}
