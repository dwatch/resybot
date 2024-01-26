// Used by Resybot (CamelCase)
export type GetRestaurantDetailsRequest = {
  "venueId": string;
}

export type GetRestaurantDetailsResponse = {
  "name": string
}

// Used by Resy (snake_case)
export type ResyGetRestaurantDetailsRequest = {
  "venue_id": string;
}

export type ResyGetRestaurantDetailsResponse = {
    "venue": VenueDetails
}

type VenueDetails = {
  "name": string
}