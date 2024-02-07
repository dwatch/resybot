import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReservationStatus } from 'src/entities/reservation/reservation.entity';
import { ReservationsService } from 'src/entities/reservation/reservation.service';

@Injectable()
export class RetirePassedReservationsJob {
  constructor(
    private readonly reservationsService: ReservationsService
  ) {}

  private readonly logger = new Logger(RetirePassedReservationsJob.name);

  @Cron('30 */15 * * * *', { timeZone: 'America/New_York' }) // 30 seconds after every 15 minutes, since Resy times are in 15 min intervals
  async run() {
    const currentDateTime = new Date().toISOString()
    const passedReservations = await this.reservationsService.findPassedReservations(currentDateTime)
    passedReservations.forEach( reservation => {
      reservation.status = ReservationStatus.PASSED
      this.reservationsService.save(reservation)
    })
  }
}