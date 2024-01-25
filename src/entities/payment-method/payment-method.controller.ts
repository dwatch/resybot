import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { PaymentMethodsService } from "./payment-method.service";
import { CreatePaymentMethodDto } from "./dto/payment-method.dto";
import { PaymentMethod } from "./payment-method.entity";

@Controller('paymentMethods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  create(@Body() createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    return this.paymentMethodsService.create(createPaymentMethodDto)
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<PaymentMethod> {
    return this.paymentMethodsService.findOne(uuid)
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string): Promise<void> {
    return this.paymentMethodsService.remove(uuid)
  }
}