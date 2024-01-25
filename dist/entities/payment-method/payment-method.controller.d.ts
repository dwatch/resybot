import { PaymentMethodsService } from "./payment-method.service";
import { CreatePaymentMethodDto } from "./dto/payment-method.dto";
import { PaymentMethod } from "./payment-method.entity";
export declare class PaymentMethodsController {
    private readonly paymentMethodsService;
    constructor(paymentMethodsService: PaymentMethodsService);
    create(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod>;
    findOne(uuid: string): Promise<PaymentMethod>;
    remove(uuid: string): Promise<void>;
}
