import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Reservation } from './reservation.entity'
import { Repository } from 'typeorm'
import { type CreateReservationDto } from './dto/create-reservation.dto'
import { ReservationStatus } from 'src/utilities/enums/reservation-status'

@Injectable()
export class ReservationsService {
  constructor (
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>
  ) {}

  async create (createReservationDto: CreateReservationDto): Promise<Reservation> {
    const reservation = new Reservation()
    reservation.user = createReservationDto.user
    reservation.restaurant = createReservationDto.restaurant
    reservation.partySize = createReservationDto.partySize
    reservation.unavailableDates = createReservationDto.unavailableDates
    reservation.desiredTimesOfWeek = createReservationDto.desiredTimesOfWeek
    reservation.status = createReservationDto.status
    reservation.reservationToken = createReservationDto.reservationToken
    reservation.reservationDate = createReservationDto.reservationDate
    return await this.reservationRepository.save(reservation)
  }

  async findOne (uuid: string): Promise<Reservation | null> {
    return await this.reservationRepository.findOneBy({ uuid })
  }

  async findPreexistingReservations (userUuid: string, venueId: string, date: Date) : Promise<Reservation[]> {
    return await this.reservationRepository.createQueryBuilder('reservation')
      .innerJoin('resybot_user', 'user', 'reservation.userUuid = user.uuid')
      .innerJoin('restaurant', 'restaurant', 'reservation.restaurantUuid = restaurant.uuid')
      .where(`user.uuid = '${userUuid}'`)
      .andWhere(`restaurant.venueId = '${venueId}'`)
      .andWhere(`reservation.status in ('${ReservationStatus.PENDING}','${ReservationStatus.BOOKED}')`)
      .andWhere(`reservation.reservationDate is null`)
      .orWhere(`reservation.reservationDate = '${date}'`)
      .getMany();
  }

  async remove (uuid: string): Promise<void> {
    await this.reservationRepository.delete(uuid)
  }
}
