import { Body, Controller, Get, Param, Post, Request, Session } from '@nestjs/common';
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
import { ErrorFactory } from 'src/utilities/error-factory';
import { parseConfigToken } from 'src/utilities/utilities';
import { CreateReservationDto } from 'src/entities/reservation/dto/create-reservation.dto';
import { ReservationStatus } from 'src/entities/reservation/reservation.entity';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly reservationsService: ReservationsService,
    private readonly resyClient: ResyClient,
    private readonly bookingService: BookingService
  ) {}

  @Post('findRestaurant')
  async findRestaurant (@Session() session, @Body() body: FindRestaurantRequest): Promise<SearchForRestaurantsResponse> {
    return await this.resyClient.searchForRestaurants(session.authToken, body.query, Constants.DEFAULT_NUM_VENUES)
  }

  @Get('/fullAvailability/:venueId/:partySize')
  async getFullRestaurantAvailability (@Param('venueId') venueId: string, @Param('partySize') partySize: number): Promise<FullRestaurantAvailabilityResponse> {
    return await this.bookingService.getFullRestaurantAvailability(venueId, partySize)
  }

  @Post('/book')
  async bookAndPersistReservation (@Session() session, @Request() req, @Body() body: BookAndPersistReservationRequest): Promise<BookReservationResponse | undefined> {    
    const restaurant = await this.restaurantsService.findOneByVenueId(body.venueId)
    if (restaurant === null) { throw ErrorFactory.notFound(`Can't find restaurant with venueId ${body.venueId}`)}

    let bookedReservationDetails: BookReservationResponse
    const createReservationDto: CreateReservationDto = {
      user: req.user,
      restaurant: restaurant,
      partySize: body.partySize,
      status: ReservationStatus.PENDING,
      unavailableDates: body.unavailableDates,
      desiredTimesOfWeek: body.desiredTimesOfWeek
    }

    if (body.configToken != null) {
      const configDetails = parseConfigToken(body.configToken)
      const existingReservations = await this.reservationsService.findPreexistingReservations(req.user.uuid, body.venueId, configDetails.day)
      if (existingReservations.length > 0) {
        throw ErrorFactory.internalServerError("A reservation has already been made. Can't make another one for this")
      }

      bookedReservationDetails = await this.bookingService.bookReservation(session.authToken, body.configToken)
      createReservationDto.reservationToken = bookedReservationDetails.resyToken
      createReservationDto.reservationDay = configDetails.day
      createReservationDto.reservationTime = configDetails.time
    }

    await this.reservationsService.create(createReservationDto)
    
    return bookedReservationDetails
  }
}