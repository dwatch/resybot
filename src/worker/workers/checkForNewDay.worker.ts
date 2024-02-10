import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CheckForNewDayDto } from '../dto/checkForNewDay.dto';
import { ResyClient } from 'src/resy/resy.client';
import { Constants } from 'src/utilities/constants';
import { RestaurantsService } from 'src/entities/restaurant/restaurant.service';

@Processor('checkForNewDay')
export class CheckForNewDayWorker {
  constructor(
    private readonly resyClient: ResyClient,
    private readonly restaurantsService: RestaurantsService
  ) {}

  private readonly logger = new Logger(CheckForNewDayWorker.name);

  @Process('search')
  async search(job: Job) {
    const data: CheckForNewDayDto = job.data
    const restaurant = data.restaurant
    const releasedDays = await this.resyClient.getRestaurantCalendar(restaurant.venueId, Constants.MIN_PARTY_SIZE, data.startDate, data.endDate)
    if (restaurant.lastCheckedDate < releasedDays.lastCalendarDay) {
      // Trigger workers in parallel to try booking reservation
      restaurant.lastCheckedDate = releasedDays.lastCalendarDay
      this.restaurantsService.save(restaurant)
    }
  }
}