import { Injectable } from '@nestjs/common'
import { type ResyGetCalendarResponse, type GetCalendarResponse } from './dto/get-calendar.dto'
import { forkJoin, from, lastValueFrom } from 'rxjs'

@Injectable()
export class ResyPresenter {
  async convertResponseToGetCalendarResponse (response: ResyGetCalendarResponse): Promise<GetCalendarResponse> {
    const scheduleObservables = response.scheduled.map((date) => {
      return from(Promise.resolve({
        date: date.date,
        reservation: date.inventory.reservation,
        event: date.inventory.event,
        walkIn: date.inventory.walk_in
      }))
    })
    return {
      lastCalendarDay: response.last_calendar_day,
      scheduled: await lastValueFrom(forkJoin(scheduleObservables))
    }
  }
}
