// Used by Resybot (CamelCase)
export type BookReservationRequest = {
  "bookToken": string;
}

export type BookReservationResponse = {
  "reservationId": string;
  "resyToken": string;
}

// Used by Resy (snake_case)
export type ResyBookReservationRequest = {
  "book_token": string;
  "source_id": string;
}

export type ResyBookReservationResponse = {
  "reservation_id": string;
  "resy_token": string;
}
