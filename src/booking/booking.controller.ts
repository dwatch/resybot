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
import { CreateReservationDto } from 'src/entities/reservation/dto/create-reservation.dto';
import { ReservationStatus } from 'src/entities/reservation/reservation.entity';
import { UtilityFunctions } from 'src/utilities/utility.functions';
import { ErrorFactory } from 'src/utilities/error-factory';
import { ConfigTokenDetails } from 'src/utilities/dto/config-token-details';
import { ResybotUserService } from 'src/entities/resybot-user/resybot-user.service';

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
    const existingRestaurant = await this.restaurantsService.findOneByVenueId(venueId)
    if (existingRestaurant === null) {
      const restaurantDetails = await this.resyClient.getRestaurantDetails(venueId)
      await this.restaurantsService.create({ name: restaurantDetails.name, venueId: venueId })
    }
    return await this.bookingService.getFullRestaurantAvailability(venueId, partySize)
  }

  @Post('/book')
  async bookAndPersistReservation (@Session() session, @Body() body: BookAndPersistReservationRequest): Promise<BookReservationResponse | undefined> { 
    const user = await this.resybotUserService.findOne(session.userUuid)
    if (user === null) { throw ErrorFactory.notFound(`Can't find user with uuid ${session.userUuid}`)}
    let restaurant = await this.restaurantsService.findOneByVenueId(body.venueId)
    if (restaurant === null) {
      const restaurantDetails = await this.resyClient.getRestaurantDetails(body.venueId)
      restaurant = await this.restaurantsService.create({ name: restaurantDetails.name, venueId: body.venueId })
    }

    // Assume every booking is a race against other bots. If there's a config, prioritize booking it first
    let bookedReservationDetails: BookReservationResponse
    let configDetails: ConfigTokenDetails
    if (body.configToken !== null) {
      try {
        configDetails = this.utilityFunctions.parseConfigToken(body.configToken)
        bookedReservationDetails = await this.bookingService.bookReservation(session.authToken, body.configToken)
      } catch (error) {
        console.log(error) // Fail silently so we can save the reservation as pending. Let async job try again later
      }
    }

    // Don't want users creating multiple reservations for a hard-to-get restaurant. Forcefully limit their reservations to 1 per restaurant
    const pendingReservationCount = +(bookedReservationDetails === undefined)
    await this.bookingService.voidExistingReservations(user.uuid, restaurant.venueId)
    await this.resybotUserService.addToPendingCount(user, pendingReservationCount)
    await this.restaurantsService.addToPendingCount(restaurant, pendingReservationCount)
    const createReservationDto: CreateReservationDto = {
      user: user,
      restaurant: restaurant,
      partySize: body.partySize,
      status: (bookedReservationDetails !== undefined) ? ReservationStatus.BOOKED : ReservationStatus.PENDING,
      unavailableDates: body.unavailableDates,
      desiredTimesOfWeek: body.desiredTimesOfWeek,
      reservationToken: bookedReservationDetails?.resyToken,
      reservationDay: (bookedReservationDetails !== undefined) ? configDetails.day : undefined,
      reservationTime: (bookedReservationDetails !== undefined) ? configDetails.time : undefined
    }
    await this.reservationsService.create(createReservationDto)

    return bookedReservationDetails
  }
}