import { ConfigTokenDetails } from "./json/config-token-details"

export function parseConfigToken (configToken: string): ConfigTokenDetails {
  const parsedToken = configToken.split("//")[1].split("/")
  return {
      venueId: parsedToken[1],
      day: parsedToken[4],
      time: parsedToken[6],
      partySize: +parsedToken[7],
      type: parsedToken[8]
  }
}