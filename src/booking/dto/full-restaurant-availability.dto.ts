import { ReservationSlot } from "src/utilities/json/reservation-slot"

export type FullRestaurantAvailabilityResponse = {
  days: ReservationSlotsByDay[]
}

type ReservationSlotsByDay = {
  slots: ReservationSlot[]
}