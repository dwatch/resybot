import { type Restaurant } from 'src/entities/restaurant/restaurant.entity'
import { type ResybotUser } from 'src/entities/resybot-user/resybot-user.entity'
import { type TimesOfWeek } from 'src/utilities/dto/times-of-week'
import { ReservationStatus } from '../reservation.entity'

export class CreateReservationDto {
  user: ResybotUser
  restaurant: Restaurant
  partySize: number
  status: ReservationStatus
  unavailableDates: string[]
  desiredTimesOfWeek: TimesOfWeek
  reservationToken?: string | undefined = undefined
  reservationDay?: string | undefined = undefined
  reservationTime?: string | undefined = undefined
}
