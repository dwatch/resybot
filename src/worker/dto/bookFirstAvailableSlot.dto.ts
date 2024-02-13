import { Reservation } from "src/entities/reservation/reservation.entity";

export class BookFirstAvailableSlotDto {
  reservation: Reservation
  date: string
}