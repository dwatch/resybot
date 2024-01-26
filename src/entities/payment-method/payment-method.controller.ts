import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { PaymentMethodsService } from './payment-method.service'
import { CreatePaymentMethodDto } from './dto/payment-method.dto'
import { type PaymentMethod } from './payment-method.entity'

@Controller('paymentMethods')
export class PaymentMethodsController {
  constructor (private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  async create (@Body() createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    return await this.paymentMethodsService.create(createPaymentMethodDto)
  }

  @Get(':uuid')
  async findOne (@Param('uuid') uuid: string): Promise<PaymentMethod> {
    return await this.paymentMethodsService.findOne(uuid)
  }

  @Delete(':uuid')
  async remove (@Param('uuid') uuid: string): Promise<void> {
    await this.paymentMethodsService.remove(uuid)
  }
}
