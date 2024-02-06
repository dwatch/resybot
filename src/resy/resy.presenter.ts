import { Injectable } from '@nestjs/common'
import { type ResyGetCalendarResponse, type GetCalendarResponse } from './dto/get-calendar.dto'
import { forkJoin, from, lastValueFrom } from 'rxjs'
import { LoginResponse, ResyLoginResponse } from './dto/login.dto'
import { ResySearchForRestaurantsResponse, SearchForRestaurantsResponse } from './dto/search-for-restaurants.dto'
import { GetRestaurantDetailsResponse, ResyGetRestaurantDetailsResponse } from './dto/restaurant-details.dto'
import { GetAvailableReservationsResponse, ResyGetAvailableReservationsResponse } from './dto/get-available-reservations.dto'
import { CreateReservationResponse, ResyCreateReservationResponse } from './dto/create-reservation.dto'
import { BookReservationResponse, ResyBookReservationResponse } from './dto/book-reservation.dto'
import { CancelReservationResponse, ResyCancelReservationResponse } from './dto/cancel-reservation.dto'

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
    const slots = response.results.venues[0].slots
    if (slots.length === 0) {
      return { slots: [] };
    }
    const slotsObservables = slots.map((slot) => {
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

  convertToCreateReservationResponse(response: ResyCreateReservationResponse): CreateReservationResponse {
    return {
        bookToken: response.book_token.value
    }
  }

  convertToBookReservationResponse(response: ResyBookReservationResponse): BookReservationResponse {
    return {
        reservationId: response.reservation_id,
        resyToken: response.resy_token
    }
  }

  convertToCancelReservationResponse(response: ResyCancelReservationResponse): CancelReservationResponse {
    return {
        refund: response.payment.refund,
    }
  }
}
