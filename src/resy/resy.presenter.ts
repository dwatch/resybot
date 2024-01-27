import { Injectable } from '@nestjs/common'
import { type ResyGetCalendarResponse, type GetCalendarResponse } from './dto/get-calendar.dto'
import { forkJoin, from, lastValueFrom } from 'rxjs'
import { LoginResponse, ResyLoginResponse } from './dto/login.dto'
import { ResySearchForRestaurantsResponse, SearchForRestaurantsResponse } from './dto/search-for-restaurants.dto'
import { GetRestaurantDetailsResponse, ResyGetRestaurantDetailsResponse } from './dto/restaurant-details.dto'
import { GetAvailableReservationsResponse, ResyGetAvailableReservationsResponse } from './dto/get-available-reservations.dto'

@Injectable()
export class ResyPresenter {
  convertToLoginResponse (response: ResyLoginResponse): LoginResponse {
    return {
      firstName: response.first_name,
      lastName: response.last_name,
      token: response.token,
      paymentMethodId: response.payment_method_id,
      paymentMethods: response.payment_methods
    }
  }

  convertToSearchForRestaurantsResponse (response: ResySearchForRestaurantsResponse): SearchForRestaurantsResponse {
    return {
      hits: response.search.hits.map((hit) =>{
          return { name: hit.name, venueId: hit.id.resy }
      })
    }
  }

  convertToGetRestaurantDetailsResponse(response: ResyGetRestaurantDetailsResponse): GetRestaurantDetailsResponse {
    return {
        name: response.venue.name
    } as GetRestaurantDetailsResponse
  }

  async convertToGetCalendarResponse (response: ResyGetCalendarResponse): Promise<GetCalendarResponse> {
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

  async convertToGetAvailableReservationsResponse (response: ResyGetAvailableReservationsResponse): Promise<GetAvailableReservationsResponse> {
    const slotsObservables = response.results.venues[0].slots.map((slot) => {
      return from(Promise.resolve({
        configToken: slot.config.token,
        reservationType: slot.config.type,
        start: slot.date.start,
        end: slot.date.end  
      }))
    })
    return {
      slots: await lastValueFrom(forkJoin(slotsObservables))
    }
  }
}
