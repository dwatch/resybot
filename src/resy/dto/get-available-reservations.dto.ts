import { ReservationSlot } from "src/models/json/reservation-slot";

// Used by Resybot (CamelCase)
export class GetAvailableReservationsResponse {
  "slots": ReservationSlot[]
}

// Used by Resy (snake_case)
export class ResyGetAvailableReservationsRequest {
  "day": string;
  "lat": number;
  "long": number;
  "party_size": number;
  "venue_id": string;
  "exclude_non_discoverable": boolean;
  "sort_by": string;
}

export class ResyGetAvailableReservationsResponse {
  "results": {
    "venues": Venue[];
  };
}

class Venue {
  "slots": Slot[]
}

class Slot {
  "config": {
    "token": string,
    "type": string
  };
  "date": {
    "start": string,
    "end": string
  };
  "payment": {
    "cancellation_fee"?: string,
    "deposit_fee"?: string,
    "is_paid"?: boolean,
    "paymet_structure"?: string,
    "secs_cancel_cut_off"?: string,
    "secs_change_cut_off"?: string,
    "service_charge"?: string,
    "service_charge_options"?: string[],
    "time_cancel_cut_off"?: string,
    "time_change_cut_off"?: string,
    "venue_share"?: string
  }
}