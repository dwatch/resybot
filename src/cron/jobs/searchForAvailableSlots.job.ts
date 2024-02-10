import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RestaurantsService } from 'src/entities/restaurant/restaurant.service';
import { Constants } from 'src/utilities/constants';
import { UtilityFunctions } from 'src/utilities/utility.functions';
import { CheckForNewDayDto } from 'src/worker/dto/checkForNewDay.dto';
import { WorkerService } from 'src/worker/worker.service';

@Injectable()
export class SearchForAvailableSlotsJob {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly workerService: WorkerService,
    private readonly utilityFunctions: UtilityFunctions
  ) {}

  private readonly logger = new Logger(SearchForAvailableSlotsJob.name);

  @Cron('* */15 0-12 * * *', { timeZone: 'America/New_York' }) // From midnight to noon, for the first of every 15 minutes, execute every second
  async run() {
    const searchPeriod = this.utilityFunctions.getCalendarPeriod(new Date(), Constants.MAX_RESERVATION_LOOKFORWARD_DAYS)
    const restaurantsWithPendingReservations = await this.restaurantsService.findAllWithPendingReservations()
    const checkForNewDayPromises = restaurantsWithPendingReservations.map( async restaurant => {
      const data: CheckForNewDayDto = { 
        "venueId": restaurant.venueId,
        "startDate": searchPeriod[0],
        "endDate": searchPeriod[1]
      }
      await this.workerService.triggerCheckForNewDayDto(data)
    })
    await Promise.all(checkForNewDayPromises)
  }
}
