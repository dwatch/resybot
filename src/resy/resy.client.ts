import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { type AxiosResponse } from 'axios'
import { type Observable, lastValueFrom, map } from 'rxjs'
import { type ResyGetCalendarResponse, type GetCalendarResponse, type ResyGetCalendarRequest } from './dto/get-calendar.dto'
import { ResyPresenter } from './resy.presenter'
import { LoginResponse, ResyLoginRequest, ResyLoginResponse } from './dto/login.dto'
import { ResySearchForRestaurantsRequest, ResySearchForRestaurantsResponse, SearchForRestaurantsResponse } from './dto/search-for-restaurants.dto'
import { GetRestaurantDetailsResponse, ResyGetRestaurantDetailsRequest, ResyGetRestaurantDetailsResponse } from './dto/restaurant-details.dto'
import { GetAvailableReservationsResponse, ResyGetAvailableReservationsRequest, ResyGetAvailableReservationsResponse } from './dto/get-available-reservations.dto'
import { CreateReservationResponse, ResyCreateReservationRequest, ResyCreateReservationResponse } from './dto/create-reservation.dto'
import { ConfigTokenDetails } from 'src/models/json/config-token-details'

@Injectable()
export class ResyClient {
  constructor (
    private readonly httpService: HttpService,
    private readonly resyPresenter: ResyPresenter
  ) {}

  private readonly baseUrl: string = process.env.BASE_URL
  private readonly apiKey: string = process.env.API_KEY
  private readonly authToken: string = process.env.AUTH_TOKEN
  private readonly resyWidget: string = process.env.RESY_WIDGET
  private readonly host: string = process.env.HOST

  // All full URLs
  private readonly LOGIN_URL = `${this.baseUrl}/3/auth/password`
  private readonly GET_CALENDAR_URL = `${this.baseUrl}/4/venue/calendar`
  private readonly SEARCH_FOR_RESTAURANTS_URL = `${this.baseUrl}/3/venuesearch/search`
  private readonly GET_RESTAURANT_DETAILS_URL = `${this.baseUrl}/2/config`
  private readonly GET_AVAILABLE_RESERVATIONS_URL = `${this.baseUrl}/4/find`
  private readonly CREATE_RESERVATION_URL = `${this.baseUrl}/3/details`

  async login(email: string, password: string): Promise<LoginResponse> {
    const headers = this.createHeaders('application/x-www-form-urlencoded')
    const payload: ResyLoginRequest = {
      "email": email,
      "password": password
    }
    const responseObservable = this.httpService.post(this.LOGIN_URL, payload, { headers: headers })
    const response = await this.extractResponse<ResyLoginResponse>(responseObservable)
    return this.resyPresenter.convertToLoginResponse(response)
  }

  async searchForRestaurants(query: string, numVenues: number, lat?: number, lng?: number): Promise<SearchForRestaurantsResponse> {
    const headers = this.createHeaders('application/json')
    const payload: ResySearchForRestaurantsRequest = {
      "per_page": numVenues,
      "query": query,
      "types": ["venue", "cuisine"]
    }
    if (lat !== undefined && lng !== undefined) {
      payload["geo"] = {"latitude": lat, "longitude": lng}
    }
    const responseObservable = this.httpService.post(this.SEARCH_FOR_RESTAURANTS_URL, payload, { headers: headers })
    const response = await this.extractResponse<ResySearchForRestaurantsResponse>(responseObservable)
    return this.resyPresenter.convertToSearchForRestaurantsResponse(response)
  }

  async getRestaurantDetails(venueId: string): Promise<GetRestaurantDetailsResponse> {
    const headers = this.createHeaders('application/json')
    const params: ResyGetRestaurantDetailsRequest = { "venue_id": venueId }
    const responseObservable = this.httpService.get(this.GET_RESTAURANT_DETAILS_URL, { headers: headers, params: params })
    const response = await this.extractResponse<ResyGetRestaurantDetailsResponse>(responseObservable)
    return this.resyPresenter.convertToGetRestaurantDetailsResponse(response)
  }

  async getRestaurantCalendar (venueId: string, partySize: number, sd: string, ed: string): Promise<GetCalendarResponse> {
    const headers = this.createHeaders('application/json')
    const params: ResyGetCalendarRequest = {
      venue_id: venueId,
      num_seats: partySize,
      start_date: sd,
      end_date: ed
    }
    const responseObservable = this.httpService.get(this.GET_CALENDAR_URL, { headers: headers, params: params })
    const response = await this.extractResponse<ResyGetCalendarResponse>(responseObservable)
    return await this.resyPresenter.convertToGetCalendarResponse(response)
  }

  async getAvailableReservations (venueId: string, date: string, partySize: number): Promise<GetAvailableReservationsResponse> {
    const headers = this.createHeaders('application/json')
    const params: ResyGetAvailableReservationsRequest = {
      "day": date,
      "lat": 0,
      "long": 0,
      "party_size": partySize,
      "venue_id": venueId,
      "exclude_non_discoverable": true,
      "sort_by": "available"
    }
    const responseObservable = this.httpService.get(this.GET_AVAILABLE_RESERVATIONS_URL, { headers: headers, params: params })
    const response = await this.extractResponse<ResyGetAvailableReservationsResponse>(responseObservable)
    return await this.resyPresenter.convertToGetAvailableReservationsResponse(response)
  }

  async createReservation (configId: string): Promise<CreateReservationResponse> {
    const headers = this.createHeaders('application/json')
    const configDetails = this.parseConfigToken(configId)
    const payload: ResyCreateReservationRequest = {
      "commit": 1, // Needs to be 1 to get a book_token, which is used in bookReservation()
      "config_id": configId,
      "day": configDetails.day,
      "party_size": configDetails.partySize
    }
    const responseObservable = this.httpService.post(this.CREATE_RESERVATION_URL, payload, { headers: headers })
    const response = await this.extractResponse<ResyCreateReservationResponse>(responseObservable)
    return await this.resyPresenter.convertToCreateReservationResponse(response)
  }

  // ======================================================== Request Helper Functions ========================================================
  private async extractResponse<T> (responseObservable: Observable<AxiosResponse<T>>): Promise<T> {
    const responseDataObservable = responseObservable.pipe(map((response: AxiosResponse) => response.data as T))
    return await lastValueFrom(responseDataObservable)
  }

  private parseConfigToken (configToken: string): ConfigTokenDetails {
    const parsedToken = configToken.split("//")[1].split("/")
    return {
        venueId: parsedToken[1],
        day: parsedToken[4],
        time: parsedToken[6],
        partySize: +parsedToken[7],
        type: parsedToken[8]
    }
  }

  private createHeaders (contentType: string): Record<string, string> {
    return {
      'Content-Type': contentType,
      Authorization: `ResyAPI api_key="${this.apiKey}"`,
      'X-Resy-Auth-Token': this.authToken,
      'X-Resy-Universal-Auth': this.authToken,
      'X-Origin': this.resyWidget,
      Origin: this.resyWidget,
      Referer: this.resyWidget,
      Host: this.host,
      'Cache-Control': 'no-cache'
    }
  }
}
