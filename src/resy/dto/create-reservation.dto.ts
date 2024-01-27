// Used by Resybot (CamelCase)
export type CreateReservationRequest = {
  "configId": string;
}

export type CreateReservationResponse = {
  "bookToken": string;
}

// Used by Resy (snake_case)
export type ResyCreateReservationRequest = {
  "commit": number;
  "config_id": string;
  "day": string;
  "party_size": number;
}

export type ResyCreateReservationResponse = {
  "book_token": {
      "date_expires": string;
      "value": string;
  };
  "cancellation": {
      "credit": { "date_cut_off"?: string; };
      "fee"?: string;
      "refund": { "date_cut_off"?: string; };
  };
  "change": { "date_cut_off"?: string; };
}
