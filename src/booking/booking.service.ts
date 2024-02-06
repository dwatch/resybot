import { Injectable } from '@nestjs/common';
import { ResyClient } from 'src/resy/resy.client';
import { FullRestaurantAvailabilityResponse } from './dto/full-restaurant-availability.dto';
import { Constants } from 'src/utilities/constants';
import { BookReservationResponse } from 'src/resy/dto/book-reservation.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly resyClient: ResyClient
  ) {}
  async bookReservation(authToken: string, configId: string): Promise<BookReservationResponse> {
    const createReservationResponse = await this.resyClient.createReservation(authToken, configId)
    return await this.resyClient.bookReservation(createReservationResponse.bookToken)
  }

  async getFullRestaurantAvailability(venueId: string, partySize: number): Promise<FullRestaurantAvailabilityResponse> {
    const today = new Date()
    const startDate = today.toISOString().split("T")[0]
    const endDate = this.addDays(today, Constants.MAX_RESERVATION_LOOKFORWARD_DAYS).toISOString().split("T")[0]

    const allDays = await this.resyClient.getRestaurantCalendar(venueId, partySize, startDate, endDate)
    const availableDays = allDays.scheduled.filter( day => day.reservation !== "unavailable" )
    const availableDatetimePromises = availableDays.map( day => this.resyClient.getAvailableReservations(venueId, day.date, partySize) )
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
