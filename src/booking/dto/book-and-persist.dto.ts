import { TimesOfWeek } from "src/utilities/json/times-of-week"

export class BookAndPersistReservationRequest {
  userUuid: string
  venueId: string
  partySize: number
  unavailableDates: string[]
  desiredTimesOfWeek: TimesOfWeek
  configToken: string | undefined
}