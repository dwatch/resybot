// Used by Resybot (CamelCase)
export class CreateReservationRequest {
  "configId": string
}

export class CreateReservationResponse {
  "bookToken": string
}

// Used by Resy (snake_case)
export class ResyCreateReservationRequest {
  "commit": number
  "config_id": string
  "day": string
  "party_size": number
}

export class ResyCreateReservationResponse {
  "book_token": {
      "date_expires": string
      "value": string
  }
  "cancellation": {
      "credit": { "date_cut_off"?: string }
      "fee"?: string
      "refund": { "date_cut_off"?: string }
  }
  "change": { "date_cut_off"?: string }
}
