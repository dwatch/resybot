import { Reservation } from '../reservation/reservation.entity';
export declare class Restaurant {
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    venueId: string;
    reservations: Reservation[];
    pendingReservationCount: number;
    newReservationReleaseTime: Date | undefined;
    lastCheckedDate: Date | undefined;
}
