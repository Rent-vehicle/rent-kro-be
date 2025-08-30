import vine from '@vinejs/vine'

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/

export const verifyUserCodeValidator = vine.compile(
  vine.object({
    code: vine.string().trim().maxLength(6).minLength(6),
  })
)

export const signupValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim(),
    lastName: vine.string().trim().optional(),
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(8).regex(passwordRegex),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim(),
  })
)

export const forgetPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().trim(),
    password: vine
      .string()
      .trim()
      .confirmed({ confirmationField: 'confirmPassword' })
      .minLength(8)
      .regex(passwordRegex),
  })
)

export const verifyEmailValidator = vine.compile(
  vine.object({
    code: vine.string().trim().maxLength(6).minLength(6),
  })
)
