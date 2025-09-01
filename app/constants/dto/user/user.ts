import { DateTime } from 'luxon'

export type UserCreateDTO = {
  firstName: string
  lastName?: string
  email: string
  password?: string
  emailVerified?: boolean
  avatarUrl?: string
  cognitoSub?: string
  displayName?: string
  phoneNumber?: string
  phoneNumberVerified?: boolean
  dateOfBirth?: DateTime
}

export type UserUpdateDTO = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  emailVerified?: boolean
  avatarUrl?: string
  cognitoSub?: string
  displayName?: string
  phoneNumber?: string
  phoneNumberVerified?: boolean
  dateOfBirth?: Date
}
