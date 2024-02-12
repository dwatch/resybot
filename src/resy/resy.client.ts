import { Injectable } from '@nestjs/common'
import { type ResyGetCalendarResponse, type GetCalendarResponse } from './dto/get-calendar.dto'
import { ResyPresenter } from './resy.presenter'
import { LoginResponse, ResyLoginRequest, ResyLoginResponse } from './dto/login.dto'
import { ResySearchForRestaurantsRequest, ResySearchForRestaurantsResponse, SearchForRestaurantsResponse } from './dto/search-for-restaurants.dto'
import { GetRestaurantDetailsResponse, ResyGetRestaurantDetailsResponse } from './dto/restaurant-details.dto'
import { GetAvailableReservationsResponse, ResyGetAvailableReservationsResponse } from './dto/get-available-reservations.dto'
import { CreateReservationResponse, ResyCreateReservationRequest, ResyCreateReservationResponse } from './dto/create-reservation.dto'
import { BookReservationResponse, ResyBookReservationRequest, ResyBookReservationResponse } from './dto/book-reservation.dto'
import { CancelReservationResponse, ResyCancelReservationRequest, ResyCancelReservationResponse } from './dto/cancel-reservation.dto'
import { Curl } from 'node-libcurl'
import { stringify, ParsedUrlQueryInput } from 'querystring';
import { UtilityFunctions } from 'src/utilities/utility.functions'
import { ErrorFactory } from 'src/utilities/error-factory'

@Injectable()
export class ResyClient {
  constructor ( 
    private readonly utilityFunctions: UtilityFunctions,
    private readonly resyPresenter: ResyPresenter
  ) {}

  private readonly baseUrl: string = process.env.BASE_URL
  private readonly apiKey: string = process.env.API_KEY
  private readonly resyWidget: string = process.env.RESY_WIDGET
  private readonly host: string = process.env.HOST

  // All full URLs
  private readonly LOGIN_URL = `${this.baseUrl}/3/auth/password`
  private readonly GET_CALENDAR_URL = `${this.baseUrl}/4/venue/calendar`
  private readonly SEARCH_FOR_RESTAURANTS_URL = `${this.baseUrl}/3/venuesearch/search`
  private readonly GET_RESTAURANT_DETAILS_URL = `${this.baseUrl}/2/config`
  private readonly GET_AVAILABLE_RESERVATIONS_URL = `${this.baseUrl}/4/find`
  private readonly CREATE_RESERVATION_URL = `${this.baseUrl}/3/details`
  private readonly BOOK_RESERVATION_URL = `${this.baseUrl}/3/book`
  private readonly CANCEL_RESERVATION_URL = `${this.baseUrl}/3/cancel`

  async login(email: string, password: string): Promise<LoginResponse> {
    const payload: ResyLoginRequest = {
      "email": email,
      "password": password
    }
    const formattedPayload = this.utilityFunctions.urlEncodePayload<ResyLoginRequest>(payload)
    const curlRequest = this.createCurlWithHeaders('application/x-www-form-urlencoded', null, formattedPayload)
    const resyResponse = await this.sendCurlRequest<ResyLoginResponse>(curlRequest, this.LOGIN_URL, null, formattedPayload)
    return this.resyPresenter.convertToLoginResponse(resyResponse)
  }

  async searchForRestaurants(resyAuthToken: string, query: string, numVenues: number, lat?: number, lng?: number): Promise<SearchForRestaurantsResponse> {
    const payload: ResySearchForRestaurantsRequest = {
      "per_page": numVenues,
      "query": query,
      "types": ["venue", "cuisine"]
    }
    if (lat !== undefined && lng !== undefined) {
      payload["geo"] = {"latitude": lat, "longitude": lng}
    }
    const formattedPayload = JSON.stringify(payload)
    const curlRequest = this.createCurlWithHeaders('application/json', resyAuthToken, formattedPayload)
    const resyResponse = await this.sendCurlRequest<ResySearchForRestaurantsResponse>(curlRequest, this.SEARCH_FOR_RESTAURANTS_URL, null, formattedPayload)
    return this.resyPresenter.convertToSearchForRestaurantsResponse(resyResponse)
  }

  async getRestaurantDetails(resyAuthToken: string, venueId: string): Promise<GetRestaurantDetailsResponse> {
    const params = { "venue_id": venueId }
    const curlRequest = this.createCurlWithHeaders('application/json', resyAuthToken)
    const resyResponse = await this.sendCurlRequest<ResyGetRestaurantDetailsResponse>(curlRequest, this.GET_RESTAURANT_DETAILS_URL, params)
    return this.resyPresenter.convertToGetRestaurantDetailsResponse(resyResponse)
  }

  async getRestaurantCalendar (venueId: string, partySize: number, sd: string, ed: string): Promise<GetCalendarResponse> {
    const params = {
      venue_id: venueId,
      num_seats: partySize,
      start_date: sd,
      end_date: ed
    }
    const curlRequest = this.createCurlWithHeaders('application/json')
    const resyResponse = await this.sendCurlRequest<ResyGetCalendarResponse>(curlRequest, this.GET_CALENDAR_URL, params)
    return await this.resyPresenter.convertToGetCalendarResponse(resyResponse)
  }

  async getAvailableReservations (venueId: string, date: string, partySize: number): Promise<GetAvailableReservationsResponse> {
    const params = {
      "day": date,
      "lat": 0,
      "long": 0,
      "party_size": partySize,
      "venue_id": venueId,
      "exclude_non_discoverable": true,
      "sort_by": "available"
    }
    const curlRequest = this.createCurlWithHeaders('application/json')
    const resyResponse = await this.sendCurlRequest<ResyGetAvailableReservationsResponse>(curlRequest, this.GET_AVAILABLE_RESERVATIONS_URL, params)
    return await this.resyPresenter.convertToGetAvailableReservationsResponse(resyResponse)
  }

  async createReservation (resyAuthToken: string, configId: string): Promise<CreateReservationResponse> {
    const configDetails = this.utilityFunctions.parseConfigToken(configId)
    const payload: ResyCreateReservationRequest = {
      "commit": 1, // Needs to be 1 to get a book_token, which is used in bookReservation()
      "config_id": configId,
      "day": configDetails.day,
      "party_size": configDetails.partySize
    }
    const formattedPayload = JSON.stringify(payload)
    const curlRequest = this.createCurlWithHeaders('application/json', resyAuthToken, formattedPayload)
    const resyResponse = await this.sendCurlRequest<ResyCreateReservationResponse>(curlRequest, this.CREATE_RESERVATION_URL, null, formattedPayload)
    return await this.resyPresenter.convertToCreateReservationResponse(resyResponse)
  }

  async bookReservation (resyAuthToken: string, bookToken: string): Promise<BookReservationResponse> {
    const payload: ResyBookReservationRequest = {
      "book_token": bookToken,
      "source_id": process.env.RES_SOURCE_ID!
    }
    const formattedPayload = this.utilityFunctions.urlEncodePayload<ResyBookReservationRequest>(payload)
    const curlRequest = this.createCurlWithHeaders('application/x-www-form-urlencoded', resyAuthToken, formattedPayload)
    const resyResponse = await this.sendCurlRequest<ResyBookReservationResponse>(curlRequest, this.BOOK_RESERVATION_URL, null, formattedPayload)
    return await this.resyPresenter.convertToBookReservationResponse(resyResponse)
  }

  // I think the resyToken needs to be regenerated. It is correctly implemented, but cannot run on its own. Need to further map out the entire flow
  // This flow is not critical so will leave here for now
  async cancelReservation(resyAuthToken: string, resyToken: string): Promise<CancelReservationResponse> {
    const payload: ResyCancelReservationRequest = {
        "resy_token": resyToken
    }
    const formattedPayload = JSON.stringify(payload)
    const curlRequest = this.createCurlWithHeaders('application/json', resyAuthToken, formattedPayload)
    const resyResponse = await this.sendCurlRequest<ResyCancelReservationResponse>(curlRequest, this.CANCEL_RESERVATION_URL, null, formattedPayload)
    return await this.resyPresenter.convertToCancelReservationResponse(resyResponse)
  }

  // ======================================================== Request Helper Functions ========================================================
  private createCurlWithHeaders (contentType: string, resyAuthToken: string | null = null, payload: string | null = null): Curl {
    const curl = new Curl()
    const headers = [
      'Accept: */*',
      `Content-Type: ${contentType}`,
      `X-Origin: ${this.resyWidget}`,
      `Origin: ${this.resyWidget}`,
      `Referer: ${this.resyWidget}`,
      'Cache-Control: no-cache',
      `Authorization: ResyAPI api_key="${this.apiKey}"`,
      `Host: ${this.host}`
    ]
    if (resyAuthToken !== null) { // Login endpoint doesn't need resyAuthToken
      headers.push(`X-Resy-Auth-Token: ${resyAuthToken}`)
      headers.push(`X-Resy-Universal-Auth: ${resyAuthToken}`)
    }
    if (payload !== null) {
      headers.push(`Content-Length: ${Buffer.byteLength(payload)}`)
    }
    curl.setOpt(Curl.option.HTTPHEADER, headers);
    return curl
  }

  private async sendCurlRequest<U> (
    curl: Curl, 
    url: string, 
    params: ParsedUrlQueryInput | null = null, 
    formattedPayload: string | null = null
  ): Promise<U> {
    return new Promise((resolve, reject) => {
      const urlWithParams = (params === null) ? url : `${url}?${stringify(params)}`
      curl.setOpt(Curl.option.URL, urlWithParams)

      if (formattedPayload !== null) {
        curl.setOpt(Curl.option.POSTFIELDS, formattedPayload)
      }

      curl.on('end', function (statusCode, body) {
        this.close()
        if (statusCode >= 200 && statusCode <= 299) {
          try {
            const bodyAsString = Buffer.isBuffer(body) ? body.toString() : body;
            const parsedBody: U = JSON.parse(bodyAsString);            
            resolve(parsedBody);  
          } catch (error) {
            reject(new Error('Error parsing response body'));
          }
        } else if (statusCode == 412) {
          reject(ErrorFactory.reservationConflict())
        } else {
          reject(new Error(`Request failed with status ${statusCode}`))
        }
      })

      curl.on('error', curl.close.bind(curl))

      curl.perform()
    })
  }
}
