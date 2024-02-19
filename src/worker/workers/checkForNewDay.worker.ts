import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CheckForNewDayDto } from '../dto/checkForNewDay.dto';
import { ResyClient } from 'src/resy/resy.client';
import { Constants } from 'src/utilities/constants';
import { RestaurantsService } from 'src/entities/restaurant/restaurant.service';
import { WorkerService } from '../worker.service';
import { ReservationsService } from 'src/entities/reservation/reservation.service';
import { BookFirstAvailableSlotDto } from '../dto/bookFirstAvailableSlot.dto';

@Processor('checkForNewDay')
export class CheckForNewDayWorker {
  constructor(
    private readonly resyClient: ResyClient,
    private readonly restaurantsService: RestaurantsService,
    private readonly reservationService: ReservationsService,
    private readonly workerService: WorkerService
  ) {}

  private readonly logger = new Logger(CheckForNewDayWorker.name);

  @Process({name:'search', concurrency: 10})
  async search(job: Job) {
    const data: CheckForNewDayDto = job.data
    const restaurant = data.restaurant
    const releasedDays = await this.resyClient.getRestaurantCalendar(restaurant.venueId, Constants.MIN_PARTY_SIZE, data.startDate, data.endDate)
    if (restaurant.lastCheckedDate === null || restaurant.lastCheckedDate < releasedDays.lastCalendarDay) { // Maybe remove this? Keep trying the entire day until it it's booked?
      // Trigger workers in parallel to try booking reservation
      const pendingReservations = await this.reservationService.findPendingReservationsByRestaurant(restaurant.venueId)
      await Promise.all(pendingReservations.map(async (reservation) => {
        const bookFirstAvailableSlotData: BookFirstAvailableSlotDto = {
          reservation: reservation,
          date: releasedDays.lastCalendarDay
        }
        this.workerService.triggerBookFirstAvailableSlot(bookFirstAvailableSlotData)
      }))
      
      restaurant.lastCheckedDate = releasedDays.lastCalendarDay
      this.restaurantsService.save(restaurant)
    }
  }
}