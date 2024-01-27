// Used by Resybot (CamelCase)
export class GetRestaurantDetailsRequest {
  "venueId": string
}

export class GetRestaurantDetailsResponse {
  "name": string
}

// Used by Resy (snake_case)
export class ResyGetRestaurantDetailsRequest {
  "venue_id": string
}

export class ResyGetRestaurantDetailsResponse {
    "venue": {
      "name": string
    }
}