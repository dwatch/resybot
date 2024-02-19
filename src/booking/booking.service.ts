import { Injectable } from '@nestjs/common';
import { ResyClient } from 'src/resy/resy.client';
import { FullRestaurantAvailabilityResponse } from './dto/full-restaurant-availability.dto';
import { Constants } from 'src/utilities/constants';
import { BookReservationResponse } from 'src/resy/dto/book-reservation.dto';
import { ReservationsService } from 'src/entities/reservation/reservation.service';
import { ReservationStatus } from 'src/entities/reservation/reservation.entity';
import { ResybotUserService } from 'src/entities/resybot-user/resybot-user.service';
import { RestaurantsService } from 'src/entities/restaurant/restaurant.service';
import { UtilityFunctions } from 'src/utilities/utility.functions';
import { ErrorFactory } from 'src/utilities/error-factory';

@Injectable()
export class BookingService {
  constructor(
    private readonly resyClient: ResyClient,
    private readonly reservationsService: ReservationsService,
    private readonly resybotUserService: ResybotUserService,
    private readonly restaurantsService: RestaurantsService,
    private readonly utilityFunctions: UtilityFunctions
  ) {}
  async bookReservation(authToken: string, configId: string): Promise<BookReservationResponse> {
    const createReservationResponse = await this.resyClient.createReservation(authToken, configId)
    return await this.resyClient.bookReservation(authToken, createReservationResponse.bookToken)
  }

  async voidExistingReservations(userUuid: string, venueId: string): Promise<void> {
    const existingReservation = await this.reservationsService.findExistingPendingReservations(userUuid, venueId)
    existingReservation.forEach( reservation => {
      reservation.status = ReservationStatus.CANCELED
      this.reservationsService.save(reservation)
      this.resybotUserService.incrementPendingCount(reservation.user, 1)
      this.restaurantsService.incrementPendingCount(reservation.restaurant, 1)
    })
  }

  async getFullRestaurantAvailability(venueId: string, partySize: number): Promise<FullRestaurantAvailabilityResponse> {
    const searchPeriod = this.utilityFunctions.getCalendarPeriod(new Date(), Constants.MAX_RESERVATION_LOOKFORWARD_DAYS)
    const allDays = await this.resyClient.getRestaurantCalendar(venueId, partySize, searchPeriod[0], searchPeriod[1])
    const availableDays = allDays.scheduled.filter( day => day.reservation !== "unavailable" )
    const availableDatetimePromises = availableDays.map( day => this.resyClient.getAvailableReservations(venueId, day.date, partySize) )
    return { 
      days: await Promise.all(availableDatetimePromises) 
    }
  }

  async cancelPendingReservation(reservationUuid: string): Promise<void> {
    const reservation = await this.reservationsService.findOne(reservationUuid)
    if (reservation.status === ReservationStatus.BOOKED) {
      throw ErrorFactory.badRequest(`Reservation ${reservationUuid} is already booked. You'll have to cancel on Resy`)
    }
    if (reservation.status === ReservationStatus.PENDING) {
      this.restaurantsService.decrementPendingCount(reservation.restaurant, 1)
      this.resybotUserService.decrementPendingCount(reservation.user, 1)
    }
    reservation.status = ReservationStatus.CANCELED
    this.reservationsService.save(reservation)
  }
}
