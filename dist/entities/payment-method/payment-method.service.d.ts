import { PaymentMethod } from "./payment-method.entity";
import { Repository } from "typeorm";
import { CreatePaymentMethodDto } from "./dto/payment-method.dto";
export declare class PaymentMethodsService {
    private paymentMethodsRepository;
    constructor(paymentMethodsRepository: Repository<PaymentMethod>);
    create(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod>;
    findOne(uuid: string): Promise<PaymentMethod | null>;
    remove(uuid: string): Promise<void>;
}
