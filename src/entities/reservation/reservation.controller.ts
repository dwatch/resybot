import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ReservationsService } from './reservation.service'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { type Reservation } from './reservation.entity'

@Controller('reservations')
export class ReservationsController {
  constructor (private readonly reservationsService: ReservationsService) {}

  @Post()
  async create (@Body() createReservationDto: CreateReservationDto): Promise<Reservation> {
    return await this.reservationsService.create(createReservationDto)
  }

  @Get()
  async findOne (@Param(':uuid') uuid: string): Promise<Reservation | null> {
    return await this.reservationsService.findOne(uuid)
  }

  @Delete()
  async remove (@Param(':uuid') uuid: string): Promise<void> {
    await this.reservationsService.remove(uuid)
  }
}
