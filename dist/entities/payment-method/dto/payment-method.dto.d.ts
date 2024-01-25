import { ResybotUser } from "src/entities/user/user.entity";
export declare class CreatePaymentMethodDto {
    user: ResybotUser;
    isDefault: boolean;
    lastFourDigits: string;
    expiryMonth: number;
    expiryYear: number;
    resyId: string;
}
