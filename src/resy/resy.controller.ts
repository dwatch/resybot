import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ResyClient } from './resy.client'
import { type GetCalendarResponse } from './dto/get-calendar.dto'
import { LoginRequest, LoginResponse } from './dto/login.dto'
import { SearchForRestaurantsRequest, SearchForRestaurantsResponse } from './dto/search-for-restaurants.dto'
import { GetRestaurantDetailsResponse } from './dto/restaurant-details.dto'
import { GetAvailableReservationsResponse } from './dto/get-available-reservations.dto'
import { CreateReservationRequest, CreateReservationResponse } from './dto/create-reservation.dto'
import { BookReservationRequest, BookReservationResponse } from './dto/book-reservation.dto'
import { CancelReservationRequest, CancelReservationResponse } from './dto/cancel-reservation.dto'

@Controller('resy-admin')
export class ResyController {
  constructor (private readonly resyClient: ResyClient) {}

  @Post('login')
  async login (@Body() body: LoginRequest): Promise<LoginResponse> {
    return await this.resyClient.login(body.email, body.password)
  }

  @Post('search')
  async searchForRestaurants (@Body() body: SearchForRestaurantsRequest): Promise<SearchForRestaurantsResponse> {
    return await this.resyClient.searchForRestaurants(body.query, body.numVenues, body.lat, body.lng)
  }

  @Get('details/:venueId')
  async getRestaurantDetails (@Param('venueId') venueId: string): Promise<GetRestaurantDetailsResponse> {
    return await this.resyClient.getRestaurantDetails(venueId)
  }

  @Get('calendar/:venueId/:partySize/:sd/:ed')
  async getCalendar (
    @Param('venueId') venueId: string,
    @Param('partySize') partySize: number,
    @Param('sd') sd: string,
    @Param('ed') ed: string
  ): Promise<GetCalendarResponse> {
    return await this.resyClient.getRestaurantCalendar(venueId, partySize, sd, ed)
  }

  @Get('available-reservations/:venueId/:date/:size')
  async getAvailableReservations (
    @Param('venueId') venueId: string,
    @Param('date') date: string,
    @Param('size') size: number
  ): Promise<GetAvailableReservationsResponse> {
    return await this.resyClient.getAvailableReservations(venueId, date, size)
  }
  
  @Post('create-reservation')
  async createReservation (@Body() body: CreateReservationRequest): Promise<CreateReservationResponse> {
    return await this.resyClient.createReservation(body.configId)
  }

  @Post('book-reservation')
  async bookReservation (@Body() body: BookReservationRequest): Promise<BookReservationResponse> {
    return await this.resyClient.bookReservation(body.bookToken)
  }

  @Post('cancel-reservation')
  async cancelReservation (@Body() body: CancelReservationRequest): Promise<CancelReservationResponse> {
    return await this.resyClient.cancelReservation(body.resyToken)
  }
}
