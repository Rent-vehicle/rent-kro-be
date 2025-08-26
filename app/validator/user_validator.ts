import vine from '@vinejs/vine'
import { passwordRegex } from './auth_validator.js'

export const updateUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
  })
)

export const updatePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string(),
    newPassword: vine
      .string()
      .trim()
      .confirmed({ confirmationField: 'confirmPassword' })
      .minLength(8)
      .regex(passwordRegex),
  })
)
