import { Controller, Get, Param } from '@nestjs/common'
import { ResyClient } from './resy.client'
import { type GetCalendarResponse } from './dto/get-calendar.dto'

@Controller('resy-admin')
export class ResyController {
  constructor (private readonly resyClient: ResyClient) {}

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
