import { Injectable } from '@nestjs/common';
import { ResyClient } from 'src/resy/resy.client';
import { FullRestaurantAvailabilityResponse } from './dto/full-restaurant-availability.dto';
import { Constants } from 'src/utilities/constants';
import { BookReservationResponse } from 'src/resy/dto/book-reservation.dto';
import { ReservationsService } from 'src/entities/reservation/reservation.service';
import { ReservationStatus } from 'src/entities/reservation/reservation.entity';
import { ResybotUserService } from 'src/entities/resybot-user/resybot-user.service';
import { RestaurantsService } from 'src/entities/restaurant/restaurant.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly resyClient: ResyClient,
    private readonly reservationsService: ReservationsService,
    private readonly resybotUserService: ResybotUserService,
    private readonly restaurantsService: RestaurantsService
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
      this.resybotUserService.addToPendingCount(reservation.user, -1)
      this.restaurantsService.addToPendingCount(reservation.restaurant, -1)
    })
  }

  async getFullRestaurantAvailability(authToken: string, venueId: string, partySize: number): Promise<FullRestaurantAvailabilityResponse> {
    const today = new Date()
    const startDate = today.toISOString().split("T")[0]
    const endDate = this.addDays(today, Constants.MAX_RESERVATION_LOOKFORWARD_DAYS).toISOString().split("T")[0]

    const allDays = await this.resyClient.getRestaurantCalendar(authToken, venueId, partySize, startDate, endDate)
    const availableDays = allDays.scheduled.filter( day => day.reservation !== "unavailable" )
    const availableDatetimePromises = availableDays.map( day => this.resyClient.getAvailableReservations(authToken, venueId, day.date, partySize) )
    return { 
      days: await Promise.all(availableDatetimePromises) 
    }
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
