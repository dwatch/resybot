import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { type AxiosResponse } from 'axios'
import { type Observable, lastValueFrom, map } from 'rxjs'
import { type ResyGetCalendarResponse, type GetCalendarResponse, type ResyGetCalendarRequest } from './dto/get-calendar.dto'
import { ResyPresenter } from './resy.presenter'
import { LoginResponse, ResyLoginRequest, ResyLoginResponse } from './dto/login.dto'

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

  // ======================================================== Request Helper Functions ========================================================
  private async extractResponse<T>(responseObservable: Observable<AxiosResponse<T>>): Promise<T> {
    const responseDataObservable = responseObservable.pipe(map((response: AxiosResponse) => response.data as T))
    return await lastValueFrom(responseDataObservable)
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
