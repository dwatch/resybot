import { Restaurant } from "src/entities/restaurant/restaurant.entity";
import { ResybotUser } from "src/entities/user/user.entity";
import { ReservationStatus } from "src/models/enums/reservation-status";
import { TimesOfWeek } from "src/models/json/times-of-week";

export class CreateReservationDto {
  user: ResybotUser
  restaurant: Restaurant
  partySize: number
  status: ReservationStatus
  unavailableDates: string[]
  desiredTimesOfWeek: TimesOfWeek
  reservationToken: string | null = null
}