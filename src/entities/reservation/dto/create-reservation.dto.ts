import { type Restaurant } from 'src/entities/restaurant/restaurant.entity'
import { type ResybotUser } from 'src/entities/resybot-user/resybot-user.entity'
import { type ReservationStatus } from 'src/utilities/enums/reservation-status'
import { type TimesOfWeek } from 'src/utilities/json/times-of-week'

export class CreateReservationDto {
  user: ResybotUser
  restaurant: Restaurant
  partySize: number
  status: ReservationStatus
  unavailableDates: string[]
  desiredTimesOfWeek: TimesOfWeek
  reservationToken: string | undefined = undefined
  reservationDate: Date | undefined = undefined
}
