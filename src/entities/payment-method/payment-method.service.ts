import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaymentMethod } from './payment-method.entity'
import { Repository } from 'typeorm'
import { type CreatePaymentMethodDto } from './dto/payment-method.dto'

@Injectable()
export class PaymentMethodsService {
  constructor (
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodsRepository: Repository<PaymentMethod>
  ) {}

  async create (createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    const paymentMethod = new PaymentMethod()
    paymentMethod.user = createPaymentMethodDto.user
    paymentMethod.isDefault = createPaymentMethodDto.isDefault
    paymentMethod.lastFourDigits = createPaymentMethodDto.lastFourDigits
    paymentMethod.expiryMonth = createPaymentMethodDto.expiryMonth
    paymentMethod.expiryYear = createPaymentMethodDto.expiryYear
    paymentMethod.resyId = createPaymentMethodDto.resyId
    return await this.paymentMethodsRepository.save(paymentMethod)
  }

  async findOne (uuid: string): Promise<PaymentMethod | null> {
    return await this.paymentMethodsRepository.findOneBy({ uuid })
  }

  async remove (uuid: string): Promise<void> {
    await this.paymentMethodsRepository.delete(uuid)
  }
}
