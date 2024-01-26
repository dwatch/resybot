import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentMethod } from './payment-method.entity'
import { PaymentMethodsService } from './payment-method.service'
import { PaymentMethodsController } from './payment-method.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  providers: [PaymentMethodsService],
  controllers: [PaymentMethodsController]
})
export class PaymentMethodsModule {}
