import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReservationsService } from 'src/entities/reservation/reservation.service';
import { RestaurantsService } from 'src/entities/restaurant/restaurant.service';
import { ResybotUserService } from 'src/entities/resybot-user/resybot-user.service';
import { BookingService } from './booking.service';
import { FindRestaurantRequest } from './dto/find-restaurant.dto';
import { SearchForRestaurantsResponse } from 'src/resy/dto/search-for-restaurants.dto';
import { ResyClient } from 'src/resy/resy.client';
import { FullRestaurantAvailabilityResponse } from './dto/full-restaurant-availability.dto';
import { BookAndPersistReservationRequest } from './dto/book-and-persist.dto';
import { BookReservationResponse } from 'src/resy/dto/book-reservation.dto';
import { Constants } from 'src/utilities/constants';
import { ErrorFactory } from 'src/utilities/error-factory';
import { parseConfigToken } from 'src/utilities/utilities';
import { CreateReservationDto } from 'src/entities/reservation/dto/create-reservation.dto';
import { ReservationStatus } from 'src/utilities/enums/reservation-status';
import moment from 'moment-timezone';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly resybotUserService: ResybotUserService,
    private readonly restaurantsService: RestaurantsService,
    private readonly reservationsService: ReservationsService,
    private readonly resyClient: ResyClient,
    private readonly bookingService: BookingService
  ) {}

  @Post('findRestaurant')
  async findRestaurant (@Body() body: FindRestaurantRequest): Promise<SearchForRestaurantsResponse> {
    return await this.resyClient.searchForRestaurants(body.query, Constants.DEFAULT_NUM_VENUES)
  }

  @Get('/fullAvailability/:venueId/:partySize')
  async getFullRestaurantAvailability (@Param('venueId') venueId: string, @Param('partySize') partySize: number): Promise<FullRestaurantAvailabilityResponse> {
    return await this.bookingService.getFullRestaurantAvailability(venueId, partySize)
  }

  @Post('/book')
  async bookAndPersistReservation (@Body() body: BookAndPersistReservationRequest): Promise<BookReservationResponse | undefined> {
    let bookedReservationResponse: BookReservationResponse
    let bookedReservationDate: Date
    let bookedReservationStatus = ReservationStatus.PENDING
    if (body.configToken != null) {
      const configDetails = parseConfigToken(body.configToken)
      const reservationDate = moment.tz(`${configDetails.day} ${configDetails.time}`, Constants.DATE_FORMAT, Constants.EST_TZ).toDate()
      const existingReservations = await this.reservationsService.findPreexistingReservations(body.userUuid, body.venueId, reservationDate)
      if (existingReservations.length > 0) {
        throw ErrorFactory.internalServerError("A reservation has already been made. Can't make another one for this")
      }
      bookedReservationResponse = await this.bookingService.bookReservation(body.configToken)
      bookedReservationDate = reservationDate
      bookedReservationStatus = ReservationStatus.BOOKED
    }

    const user = await this.resybotUserService.findOne(body.userUuid)
    if (user === null) { throw ErrorFactory.notFound(`Can't find user with uuid ${body.userUuid}`) }
    
    const restaurant = await this.restaurantsService.findOneByVenueId(body.venueId)
    if (restaurant === null) { throw ErrorFactory.notFound(`Can't find restaurant with venueId ${body.venueId}`)}

    const createReservationDto: CreateReservationDto = {
      user: user,
      restaurant: restaurant,
      partySize: body.partySize,
      status: bookedReservationStatus,
      unavailableDates: body.unavailableDates,
      desiredTimesOfWeek: body.desiredTimesOfWeek,
      reservationToken: bookedReservationResponse?.resyToken,
      reservationDate: bookedReservationDate
    }
    await this.reservationsService.create(createReservationDto)
    
    return bookedReservationResponse
  }
}