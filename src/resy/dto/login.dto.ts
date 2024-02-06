import { PaymentMethodDetails } from "src/utilities/dto/payment-method-details"

// Used by Resybot (CamelCase)
export class LoginRequest {
  "email": string
  "password": string
}

export class LoginResponse {
  "firstName": string
  "lastName": string
  "token": string
  "paymentMethodId": number
  "paymentMethods": PaymentMethodDetails[]
}

// Used by Resy (snake_case)
export class ResyLoginRequest {
  "email": string
  "password": string
  }
  
export class ResyLoginResponse {
    "first_name": string
    "last_name": string
    "token": string
    "payment_method_id": number
    "payment_methods": PaymentMethodDetails[]
}
