import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reservation } from "./reservation.entity";
import { Repository } from "typeorm";
import { CreateReservationDto } from "./dto/create-reservation.dto";

@Injectable()
export class ReservationsService {
  constructor (
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>
  ) {}
  
  create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const reservation = new Reservation()
    reservation.user = createReservationDto.user
    reservation.restaurant = createReservationDto.restaurant
    reservation.partySize = createReservationDto.partySize
    reservation.unavailableDates = createReservationDto.unavailableDates
    reservation.desiredTimesOfWeek = createReservationDto.desiredTimesOfWeek
    reservation.status = createReservationDto.status
    reservation.reservationToken = createReservationDto.reservationToken
    return this.reservationRepository.save(reservation)
  }

  findOne(uuid: string): Promise<Reservation | null> {
    return this.reservationRepository.findOneBy({ uuid })
  }

  async remove(uuid: string): Promise<void> {
    await this.reservationRepository.delete(uuid)
  }
}