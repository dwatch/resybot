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
import { Restaurant } from 'src/entities/restaurant/restaurant.entity';
import { ResybotUser } from 'src/entities/resybot-user/resybot-user.entity';
import { CreateReservationDto } from 'src/entities/reservation/dto/create-reservation.dto';
import { TimesOfWeek } from 'src/utilities/dto/times-of-week';


@Injectable()
export class BookingService {
  constructor(
    private readonly resyClient: ResyClient,
    private readonly reservationsService: ReservationsService,
    private readonly resybotUserService: ResybotUserService,
    private readonly restaurantsService: RestaurantsService,
    private readonly utilityFunctions: UtilityFunctions
  ) {}
  async getOrCreateRestaurant(venueId: string): Promise<Restaurant> {
    let restaurant = await this.restaurantsService.findOneByVenueId(venueId)
    if (restaurant === null) {
      const restaurantDetails = await this.resyClient.getRestaurantDetails(venueId)
      restaurant = await this.restaurantsService.create({ name: restaurantDetails.name, venueId: venueId })
    }
    return restaurant
  }

  async bookReservation(authToken: string, configId: string): Promise<BookReservationResponse> {
    const createReservationResponse = await this.resyClient.createReservation(authToken, configId)
    return await this.resyClient.bookReservation(authToken, createReservationResponse.bookToken)
  }

  async persistProcessedReservation(
    user: ResybotUser, 
    restaurant: Restaurant, 
    partySize: number, 
    unavailableDates: string[], 
    desiredTimesOfWeek: TimesOfWeek, 
    configToken: string | undefined, 
    resyToken: string | undefined
  ): Promise<void> {
    const configDetails = configToken === undefined ? undefined : this.utilityFunctions.parseConfigToken(configToken)
    await this.voidExistingReservations(user.uuid, restaurant.venueId)
    if (resyToken === undefined) {
      await this.resybotUserService.incrementPendingCount(user, 1)
      await this.restaurantsService.incrementPendingCount(restaurant, 1)  
    }
    const createReservationDto: CreateReservationDto = {
      user: user,
      restaurant: restaurant,
      partySize: partySize,
      status: (resyToken === undefined) ? ReservationStatus.PENDING : ReservationStatus.BOOKED,
      unavailableDates: unavailableDates,
      desiredTimesOfWeek: desiredTimesOfWeek,
      reservationToken: resyToken,
      reservationDay: (resyToken === undefined) ? undefined : configDetails.day,
      reservationTime: (resyToken === undefined) ? undefined : configDetails.time
    }
    await this.reservationsService.create(createReservationDto)
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
