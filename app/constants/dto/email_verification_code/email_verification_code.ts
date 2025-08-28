import { DateTime } from 'luxon'

export interface EmailVerificationCodeUpdateDTO {
  code?: number
  isUsed?: boolean
  expiresAt?: DateTime
}

export interface EmailVerificationCodeCreateDTO {
  userId: number
  code: number
  expiresAt?: DateTime
}
