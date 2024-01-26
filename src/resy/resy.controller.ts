import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ResyClient } from './resy.client'
import { type GetCalendarResponse } from './dto/get-calendar.dto'
import { LoginRequest, LoginResponse } from './dto/login.dto'
import { SearchForRestaurantsRequest, SearchForRestaurantsResponse } from './dto/search-for-restaurants.dto'

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

  @Get('getCalendar/:venueId/:partySize/:sd/:ed')
  async getCalendar (
    @Param('venueId') venueId: string,
    @Param('partySize') partySize: number,
    @Param('sd') sd: string,
    @Param('ed') ed: string
  ): Promise<GetCalendarResponse> {
    return await this.resyClient.getRestaurantCalendar(venueId, partySize, sd, ed)
  }
}
