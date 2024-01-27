// Used by Resybot (CamelCase)
export class CancelReservationRequest {
  "resyToken": string;
}

export class CancelReservationResponse {
  "refund": number;
}

// Used by Resy (snake_case)
export class ResyCancelReservationRequest {
    "resy_token": string;
}

export class ResyCancelReservationResponse {
  "payment": {
    "refund": number
  };
}