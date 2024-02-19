import { Body, Controller, Get, Param, Post, Session } from '@nestjs/common';
import { ReservationsService } from 'src/entities/reservation/reservation.service';
import { RestaurantsService } from 'src/entities/restaurant/restaurant.service';
import { BookingService } from './booking.service';
import { FindRestaurantRequest } from './dto/find-restaurant.dto';
import { SearchForRestaurantsResponse } from 'src/resy/dto/search-for-restaurants.dto';
import { ResyClient } from 'src/resy/resy.client';
import { FullRestaurantAvailabilityResponse } from './dto/full-restaurant-availability.dto';
import { BookAndPersistReservationRequest } from './dto/book-and-persist.dto';
import { BookReservationResponse } from 'src/resy/dto/book-reservation.dto';
import { Constants } from 'src/utilities/constants';
import { UtilityFunctions } from 'src/utilities/utility.functions';
import { ErrorFactory } from 'src/utilities/error-factory';
import { ResybotUserService } from 'src/entities/resybot-user/resybot-user.service';
import { CancelReservationRequest } from 'src/booking/dto/cancel-reservation.dto';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly utilityFunctions: UtilityFunctions,
    private readonly restaurantsService: RestaurantsService,
    private readonly reservationsService: ReservationsService,
    private readonly resybotUserService: ResybotUserService,
    private readonly resyClient: ResyClient,
    private readonly bookingService: BookingService
  ) {}

  @Post('findRestaurant')
  async findRestaurant (@Session() session, @Body() body: FindRestaurantRequest): Promise<SearchForRestaurantsResponse> {
    return await this.resyClient.searchForRestaurants(session.authToken, body.query, Constants.DEFAULT_NUM_VENUES)
  }

  @Get('/fullAvailability/:venueId/:partySize')
  async getFullRestaurantAvailability (@Param('venueId') venueId: string, @Param('partySize') partySize: number): Promise<FullRestaurantAvailabilityResponse> {
    const restaurant = await this.bookingService.getOrCreateRestaurant(venueId) // This ensures the restaurant is persisted in our DB
    return await this.bookingService.getFullRestaurantAvailability(restaurant.venueId, partySize)
  }

  @Post('/cancel')
  async cancelReservation (@Body() body: CancelReservationRequest): Promise<void> {
    return await this.bookingService.cancelPendingReservation(body.reservationUuid)
  }

  @Post('/book')
  async bookAndPersistReservation (@Session() session, @Body() body: BookAndPersistReservationRequest): Promise<BookReservationResponse | undefined> { 
    const restaurant = await this.bookingService.getOrCreateRestaurant(body.venueId)
    const user = await this.resybotUserService.findOne(session.userUuid) ?? (() => { throw ErrorFactory.notFound(`Can't find user with uuid ${session.userUuid}`) })()

    // Assume every booking is a race against other bots. If there's a config, prioritize booking it first
    const bookedReservationDetails = body.configToken === null ? null : await this.bookingService.bookReservation(session.authToken, body.configToken)

    // Don't want users creating multiple reservations for a hard-to-get restaurant. Forcefully limit their reservations to 1 per restaurant
    await this.bookingService.persistProcessedReservation(
      user, 
      restaurant, 
      body.partySize, 
      body.unavailableDates, 
      body.desiredTimesOfWeek, 
      body.configToken, 
      bookedReservationDetails?.resyToken
    )

    return bookedReservationDetails
  }


}