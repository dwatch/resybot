// Used by Resybot (CamelCase)
export type SearchForRestaurantsRequest = {
  "query": string
  "numVenues": number
  "lat"?: number
  "lng"?: number
}

export type SearchForRestaurantsResponse = {
  "hits": RestaurantDetails[]
}

type RestaurantDetails = {
  "name": string,
  "venueId": string
}

// Used by Resy (snake_case)
export type ResySearchForRestaurantsRequest = {
  "geo"?: {
      "latitude": number;
      "longitude": number;
  };
  "per_page": number;
  "query": string;
  "types": string[];
}

export type ResySearchForRestaurantsResponse = {
    "search": {
        "hits": ResyRestaurantDetails[];
    };
}

type ResyRestaurantDetails = {
  "name": string
  "id": {
      "resy": string // venue_id
  }
}

