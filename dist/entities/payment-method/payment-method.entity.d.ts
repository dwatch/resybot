import { ResybotUser } from '../user/user.entity';
export declare class PaymentMethod {
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    user: ResybotUser;
    isDefault: boolean;
    lastFourDigits: string;
    expiryMonth: number;
    expiryYear: number;
    resyId: string;
}
