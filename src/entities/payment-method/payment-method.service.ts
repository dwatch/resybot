import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentMethod } from "./payment-method.entity";
import { Repository } from "typeorm";
import { CreatePaymentMethodDto } from "./dto/payment-method.dto";

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodsRepository: Repository<PaymentMethod>,
  ) {}

  create(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    const paymentMethod = new PaymentMethod()
    paymentMethod.user = createPaymentMethodDto.user
    paymentMethod.isDefault = createPaymentMethodDto.isDefault
    paymentMethod.lastFourDigits = createPaymentMethodDto.lastFourDigits
    paymentMethod.expiryMonth = createPaymentMethodDto.expiryMonth
    paymentMethod.expiryYear = createPaymentMethodDto.expiryYear
    paymentMethod.resyId = createPaymentMethodDto.resyId
    return this.paymentMethodsRepository.save(paymentMethod)
  }

  findOne(uuid: string): Promise<PaymentMethod | null> {
    return this.paymentMethodsRepository.findOneBy({ uuid })
  }

  async remove(uuid: string): Promise<void> {
    await this.paymentMethodsRepository.delete(uuid)
  }
}