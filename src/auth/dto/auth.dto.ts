export class LoginDto {
  email: string
  sub: string
}

export class CreateJwtTokenRequest {
  sub: string
}

export class CreateJwtTokenResponse {
  authToken: string
}