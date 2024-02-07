import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SearchForAvailableSlotsJob {
  private readonly logger = new Logger(SearchForAvailableSlotsJob.name);

  @Cron('* */15 0-12 * * *', { timeZone: 'America/New_York' }) // From midnight to noon, for the first of every 15 minutes, execute every second
  async run() {
    const now = new Date()
  }
}
