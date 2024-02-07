import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RestaurantsService } from 'src/entities/restaurant/restaurant.service';

@Injectable()
export class SearchForAvailableSlotsJob {
  constructor(
    private readonly restaurantsService: RestaurantsService
  ) {}

  private readonly logger = new Logger(SearchForAvailableSlotsJob.name);

  @Cron('* */15 0-12 * * *', { timeZone: 'America/New_York' }) // From midnight to noon, for the first of every 15 minutes, execute every second
  async run() {
    const now = new Date()
    const restaurantsWithPendingReservations = await this.restaurantsService.findAllWithPendingReservations()
    restaurantsWithPendingReservations.forEach( restaurant => {
      // Send to a queue that runs the query for new restaurants. Then have that send to another queue to book per reservation
    })
  }
}
