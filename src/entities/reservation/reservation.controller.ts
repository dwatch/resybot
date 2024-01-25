import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ReservationsService } from "./reservation.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { Reservation } from "./reservation.entity";

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto): Promise<Reservation> {
    return this.reservationsService.create(createReservationDto)
  }

  @Get()
  findOne(@Param(':uuid') uuid: string): Promise<Reservation | null> {
    return this.reservationsService.findOne(uuid)
  }

  @Delete()
  async remove(@Param(':uuid') uuid: string): Promise<void> {
    await this.reservationsService.remove(uuid)
  }
}