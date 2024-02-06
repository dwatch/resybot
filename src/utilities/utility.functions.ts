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
}

