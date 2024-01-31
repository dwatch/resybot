import { type ResybotUser } from 'src/entities/resybot-user/resybot-user.entity'

export class CreatePaymentMethodDto {
  user: ResybotUser
  isDefault: boolean
  lastFourDigits: string
  expiryMonth: number
  expiryYear: number
  resyId: string
}
