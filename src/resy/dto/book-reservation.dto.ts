// Used by Resybot (CamelCase)
export class BookReservationRequest {
  "bookToken": string;
}

export class BookReservationResponse {
  "reservationId": string;
  "resyToken": string;
}

// Used by Resy (snake_case)
export class ResyBookReservationRequest {
  "book_token": string;
  "source_id": string;
}

export class ResyBookReservationResponse {
  "reservation_id": string;
  "resy_token": string;
}
