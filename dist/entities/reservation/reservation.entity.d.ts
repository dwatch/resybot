import { ResybotUser } from "../user/user.entity";
import { Restaurant } from "../restaurant/restaurant.entity";
import { ReservationStatus } from "src/models/enums/reservation-status";
import { TimesOfWeek } from "src/models/json/times-of-week";
export declare class Reservation {
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    user: ResybotUser;
    restaurant: Restaurant;
    partySize: number;
    unavailableDates: string[];
    desiredTimesOfWeek: TimesOfWeek;
    status: ReservationStatus;
    reservationDate?: Date | undefined;
    reservationToken?: string | undefined;
}
