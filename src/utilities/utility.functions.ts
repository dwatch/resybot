import { Injectable } from "@nestjs/common"
import { ConfigTokenDetails } from "./dto/config-token-details"

@Injectable()
export class UtilityFunctions {
  parseConfigToken (configToken: string): ConfigTokenDetails {
    const parsedToken = configToken.split("//")[1].split("/")
    return {
        venueId: parsedToken[1],
        day: parsedToken[4],
        time: parsedToken[6],
        partySize: +parsedToken[7],
        type: parsedToken[8]
    }
  }

  urlEncodePayload<T>(payload: T): string {
    return Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&')
  }

  // This assumes Resy only releases on a whole minute
  convertDateToResyTime(date: Date): string {
    const hour = date.getHours
    const minutes = date.getMinutes
    return `${hour}:${minutes}:00`
  }

  getCalendarPeriod(startDate: Date, numDays: number): string[] {
    const periodStart = startDate.toISOString().split("T")[0]
    const periodEnd = this.addDays(startDate, numDays).toISOString().split("T")[0]
    return [periodStart, periodEnd]
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}

