import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ResyClient } from 'src/resy/resy.client';
import { BookFirstAvailableSlotDto } from '../dto/bookFirstAvailableSlot.dto';
import { BookingService } from 'src/booking/booking.service';
import { ReservationStatus } from 'src/entities/reservation/reservation.entity';
import { ReservationsService } from 'src/entities/reservation/reservation.service';

@Processor('bookFirstAvailableSlot')
export class BookFirstAvailableSlotWorker {
  constructor(
    private readonly resyClient: ResyClient,
    private readonly bookingService: BookingService,
    private readonly reservationsService: ReservationsService
  ) {}
  
  private readonly logger = new Logger(BookFirstAvailableSlotWorker.name);

  @Process({name:'run', concurrency: 10})
  async run(job: Job) {
    const data: BookFirstAvailableSlotDto = job.data
    const reservation = data.reservation
    const venueId = reservation.restaurant.venueId
    const userAuth = reservation.user.authToken

    // See if the user wants this day. If not, then end run
    const dayOfWeek = new Date(data.date).getDay()
    const desiredSlots = reservation.desiredTimesOfWeek[dayOfWeek]
    if (desiredSlots.length == 0 || reservation.unavailableDates.includes(data.date)) { return }

    // Pull availableSlots. Filter for matching times
    const availableSlots = await this.resyClient.getAvailableReservations(venueId, data.date, reservation.partySize)
    const matchingSlots = availableSlots.slots.filter( slot => slot.start.split(" ")[1] in desiredSlots )

    // For each matching time, try to book. Stop on first successful book
    matchingSlots.forEach( async slot => {
      try {
        const bookingResponse = await this.bookingService.bookReservation(userAuth, slot.configToken)
        reservation.reservationDay = data.date
        reservation.reservationTime = slot.start.split(" ")[1]
        reservation.reservationToken = bookingResponse.resyToken
        reservation.status = ReservationStatus.BOOKED
        this.reservationsService.save(reservation)
        return
      } catch (err) {
        this.logger.log(`Couldn't book reservation for user ${reservation.user.uuid} at ${reservation.restaurant.venueId} on ${slot.start}`)
      }
    })
  }
}