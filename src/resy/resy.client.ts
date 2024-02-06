import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
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
import { parseConfigToken } from 'src/utilities/utilities'

  // const formattedPayload = (contentType === 'application/x-www-form-urlencoded') 
  // ? Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&')
  // : JSON.stringify(payload)

@Injectable()
export class ResyClient {
  constructor (
    private readonly httpService: HttpService,
    private readonly resyPresenter: ResyPresenter
  ) {
    //this.setupLoggingInterceptor()
  }

  private setupLoggingInterceptor(): void {
    const axios = this.httpService.axiosRef;

    // Request interceptor
    axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        console.log('Starting Request', JSON.stringify(config, null, 2));
        return config;
    }, (error) => {
        console.error('Request Error', error);
        return Promise.reject(error);
    });

    // Response interceptor
    axios.interceptors.response.use((response: AxiosResponse) => {
        console.log('Response:', JSON.stringify(response.data, null, 2));
        return response;
    }, (error) => {
        console.error('Response Error', error);
        return Promise.reject(error);
    });
  }

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
  private readonly BOOK_RESERVATION_URL = `${this.baseUrl}/3/book`
  private readonly CANCEL_RESERVATION_URL = `${this.baseUrl}/3/cancel`

  async login(email: string, password: string): Promise<LoginResponse> {
    const payload: ResyLoginRequest = {
      "email": email,
      "password": password
    }
    const resyResponse = await this.sendPostRequest<ResyLoginRequest, ResyLoginResponse>(this.LOGIN_URL, 'application/x-www-form-urlencoded', payload)
    return this.resyPresenter.convertToLoginResponse(resyResponse)
  }

  async searchForRestaurants(authToken: string, query: string, numVenues: number, lat?: number, lng?: number): Promise<SearchForRestaurantsResponse> {
    const payload: ResySearchForRestaurantsRequest = {
      "per_page": numVenues,
      "query": query,
      "types": ["venue", "cuisine"]
    }
    if (lat !== undefined && lng !== undefined) {
      payload["geo"] = {"latitude": lat, "longitude": lng}
    }
    const formattedPayload = JSON.stringify(payload)
    const curlRequest = this.createCurlWithHeaders('application/json', authToken, formattedPayload)
    const resyResponse = await this.sendCurlRequest<ResySearchForRestaurantsResponse>(curlRequest, this.SEARCH_FOR_RESTAURANTS_URL, null, formattedPayload)
    return this.resyPresenter.convertToSearchForRestaurantsResponse(resyResponse)
  }

  async getRestaurantDetails(authToken: string, venueId: string): Promise<GetRestaurantDetailsResponse> {
    const params = { "venue_id": venueId }
    const curlRequest = this.createCurlWithHeaders('application/json', authToken)
    const resyResponse = await this.sendCurlRequest<ResyGetRestaurantDetailsResponse>(curlRequest, this.GET_RESTAURANT_DETAILS_URL, params)
    return this.resyPresenter.convertToGetRestaurantDetailsResponse(resyResponse)
  }

  async getRestaurantCalendar (authToken: string, venueId: string, partySize: number, sd: string, ed: string): Promise<GetCalendarResponse> {
    const params = {
      venue_id: venueId,
      num_seats: partySize,
      start_date: sd,
      end_date: ed
    }
    const curlRequest = this.createCurlWithHeaders('application/json', authToken)
    const resyResponse = await this.sendCurlRequest<ResyGetCalendarResponse>(curlRequest, this.GET_CALENDAR_URL, params)
    return await this.resyPresenter.convertToGetCalendarResponse(resyResponse)
  }

  async getAvailableReservations (authToken: string, venueId: string, date: string, partySize: number): Promise<GetAvailableReservationsResponse> {
    const params = {
      "day": date,
      "lat": 0,
      "long": 0,
      "party_size": partySize,
      "venue_id": venueId,
      "exclude_non_discoverable": true,
      "sort_by": "available"
    }
    const curlRequest = this.createCurlWithHeaders('application/json', authToken)
    const resyResponse = await this.sendCurlRequest<ResyGetAvailableReservationsResponse>(curlRequest, this.GET_AVAILABLE_RESERVATIONS_URL, params)
    return await this.resyPresenter.convertToGetAvailableReservationsResponse(resyResponse)
  }

  async createReservation (authToken: string, configId: string): Promise<CreateReservationResponse> {
    const configDetails = parseConfigToken(configId)
    const payload: ResyCreateReservationRequest = {
      "commit": 1, // Needs to be 1 to get a book_token, which is used in bookReservation()
      "config_id": configId,
      "day": configDetails.day,
      "party_size": configDetails.partySize
    }
    const formattedPayload = JSON.stringify(payload)
    const curlRequest = this.createCurlWithHeaders('application/json', authToken, formattedPayload)
    const resyResponse = await this.sendCurlRequest<ResyCreateReservationResponse>(curlRequest, this.CREATE_RESERVATION_URL, null, formattedPayload)
    return await this.resyPresenter.convertToCreateReservationResponse(resyResponse)
  }

  async bookReservation (authToken: string, bookToken: string): Promise<BookReservationResponse> {
    const payload: ResyBookReservationRequest = {
      "book_token": bookToken,
      "source_id": process.env.RES_SOURCE_ID!
    }
    const formattedPayload = this.urlEncodePayload<ResyBookReservationRequest>(payload)
    const curlRequest = this.createCurlWithHeaders('application/x-www-form-urlencoded', authToken, formattedPayload)
    const resyResponse = await this.sendCurlRequest<ResyBookReservationResponse>(curlRequest, this.BOOK_RESERVATION_URL, null, formattedPayload)
    return await this.resyPresenter.convertToBookReservationResponse(resyResponse)
  }

  // I think the resyToken needs to be regenerated. It is correctly implemented, but cannot run on its own. Need to further map out the entire flow
  // This flow is not critical so will leave here for now
  async cancelReservation(authToken: string, resyToken: string): Promise<CancelReservationResponse> {
    const payload: ResyCancelReservationRequest = {
        "resy_token": resyToken
    }
    const formattedPayload = JSON.stringify(payload)
    const curlRequest = this.createCurlWithHeaders('application/json', authToken, formattedPayload)
    const resyResponse = await this.sendCurlRequest<ResyCancelReservationResponse>(curlRequest, this.CANCEL_RESERVATION_URL, null, formattedPayload)
    return await this.resyPresenter.convertToCancelReservationResponse(resyResponse)
  }

  // ======================================================== Request Helper Functions ========================================================
  private urlEncodePayload<T>(payload: T): string {
    return Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&')
  }
  
  private async sendGetRequest<U> (url: string, contentType: string, params: ParsedUrlQueryInput): Promise<U> {
    const urlWithParams = `${url}?${stringify(params)}`;
    return new Promise((resolve, reject) => {
      const curl = new Curl()
      // Formatting Request Headers and Body
      this.addHeadersToCurl(curl, contentType)
      curl.setOpt(Curl.option.URL, urlWithParams)
      curl.on('end', function (statusCode, body) {
        this.close();
        if (statusCode >= 200 && statusCode <= 299) {
          try {
            const bodyAsString = Buffer.isBuffer(body) ? body.toString() : body;
            const parsedBody: U = JSON.parse(bodyAsString);            
            resolve(parsedBody);  
          } catch (error) {
            reject(new Error('Error parsing response body'));
          }
        } else {
          reject(new Error(`Request failed with status ${statusCode}`))
        }
      })
      curl.on('error', curl.close.bind(curl));
      // Execute
      curl.perform();
    })
  }

  private async sendPostRequest<T,U> (url: string, contentType: string, payload: T): Promise<U> {
    const formattedPayload = (contentType === 'application/x-www-form-urlencoded') 
      ? Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&')
      : JSON.stringify(payload)
    return new Promise((resolve, reject) => {
      const curl = new Curl()
      // Formatting Request Headers and Body
      this.addHeadersToCurl(curl, contentType, formattedPayload)
      curl.setOpt(Curl.option.URL, url)
      curl.setOpt(Curl.option.POSTFIELDS, formattedPayload)
      //curl.setOpt(Curl.option.VERBOSE, true)
      // Setting Execution Procedures
      curl.on('end', function (statusCode, body) {
        this.close();
        if (statusCode >= 200 && statusCode <= 299) {
          try {
            const bodyAsString = Buffer.isBuffer(body) ? body.toString() : body;
            const parsedBody: U = JSON.parse(bodyAsString);            
            resolve(parsedBody);  
          } catch (error) {
            reject(new Error('Error parsing response body'));
          }
        } else {
          reject(new Error(`Request failed with status ${statusCode}`))
        }
      })
      curl.on('error', curl.close.bind(curl));
      // Execute
      curl.perform();
    })
  }

  private addHeadersToCurl (curl: Curl, contentType: string, payload: string | null = null) {
    const headers = [
      'Accept: */*',
      `Content-Type: ${contentType}`,
      `X-Resy-Auth-Token: ${this.authToken}`,
      `X-Resy-Universal-Auth: ${this.authToken}`,
      `X-Origin: ${this.resyWidget}`,
      `Origin: ${this.resyWidget}`,
      `Referer: ${this.resyWidget}`,
      'Cache-Control: no-cache',
      `Authorization: ResyAPI api_key="${this.apiKey}"`,
      `Host: ${this.host}`
    ]
    if (payload !== null) {
      headers.push(`Content-Length: ${Buffer.byteLength(payload)}`)
    }
    curl.setOpt(Curl.option.HTTPHEADER, headers);
  }

  private createCurlWithHeaders (contentType: string, authToken: string, payload: string | null = null): Curl {
    const curl = new Curl()
    const headers = [
      'Accept: */*',
      `Content-Type: ${contentType}`,
      `X-Resy-Auth-Token: ${authToken}`,
      `X-Resy-Universal-Auth: ${authToken}`,
      `X-Origin: ${this.resyWidget}`,
      `Origin: ${this.resyWidget}`,
      `Referer: ${this.resyWidget}`,
      'Cache-Control: no-cache',
      `Authorization: ResyAPI api_key="${this.apiKey}"`,
      `Host: ${this.host}`
    ]
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
        } else {
          reject(new Error(`Request failed with status ${statusCode}`))
        }
      })

      curl.on('error', curl.close.bind(curl))

      curl.perform()
    })
  }
}
