import { PaymentMethod } from '../payment-method/payment-method.entity';
import { Reservation } from '../reservation/reservation.entity';
export declare class ResybotUser {
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    authToken: string;
    paymentMethods: PaymentMethod[];
    pendingReservationCount: number;
    reservations: Reservation[];
}
