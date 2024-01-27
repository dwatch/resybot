// Used by Resybot (CamelCase)
export class SearchForRestaurantsRequest {
  "query": string
  "numVenues": number
  "lat"?: number
  "lng"?: number
}

export class SearchForRestaurantsResponse {
  "hits": RestaurantDetails[]
}

class RestaurantDetails {
  "name": string
  "venueId": string
}

// Used by Resy (snake_case)
export class ResySearchForRestaurantsRequest {
  "geo"?: {
      "latitude": number
      "longitude": number
  };
  "per_page": number
  "query": string
  "types": string[]
}

export class ResySearchForRestaurantsResponse {
    "search": {
        "hits": ResyRestaurantDetails[]
    };
}

class ResyRestaurantDetails {
  "name": string
  "id": {
      "resy": string // venue_id
  }
}

