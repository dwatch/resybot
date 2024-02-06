import { ReservationSlot } from "src/utilities/dto/reservation-slot"

export type FullRestaurantAvailabilityResponse = {
  days: ReservationSlotsByDay[]
}

type ReservationSlotsByDay = {
  slots: ReservationSlot[]
}