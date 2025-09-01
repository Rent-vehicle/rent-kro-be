import BadRequestException from '#exceptions/bad_request_exception.ts'
import InvalidCredentialsException from '#exceptions/invalid_credentials_exception'
import ModelAlreadyExistsException from '#exceptions/model_already_exists_exception'
import NotFoundException from '#exceptions/not_found_exception'
import UnAuthenticatedException from '#exceptions/unauthenticated_exception'
import User from '#models/user'
import { authService } from '#services/entities/auth.service'
import { emailVerificationService } from '#services/entities/email_verification_code.service'
import { userService } from '#services/entities/user.service'
import { oauthService } from '#services/factories/oAuth.service'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import { StatusCodes } from 'http-status-codes'
import { DateTime } from 'luxon'
import { UserCreateDTO } from '../constants/dto/user/user.js'
import { userTransformer } from '../transformer/user/user_base_transformer.js'
import { spiltName } from '../utils/helpers.js'
import {
  forgetPasswordValidator,
  googleLoginValidator,
  loginValidator,
  resetPasswordValidator,
  signupValidator,
  verifyEmailValidator,
} from '../validator/auth_validator.js'
import logger from '@adonisjs/core/services/logger'

export default class AuthController {
  public async signup({ request, response }: HttpContext) {
    const sanitizedData = await request.validateUsing(signupValidator)

    const existingUser = await userService.findCacheByEmail(sanitizedData.email)

    if (existingUser) {
      throw new ModelAlreadyExistsException(
        'If this email is registered, you’ll receive a verification code'
      )
    }

    const user = await userService.createUser(sanitizedData)

    const { success } = await emailVerificationService.generateAndSendVerificationCode(user)

    const token = await authService.createAccessToken(user)

    return response.json({
      user: userTransformer(user),
      token: token,
      isVerificationEmailSent: success,
    })
  }

  public async login({ request, response }: HttpContext) {
    const { ...sanitizedData } = await request.validateUsing(loginValidator)

    const user = await userService.verifyCredentials(sanitizedData.email, sanitizedData.password)

    if (!user) {
      throw new InvalidCredentialsException('Invalid credentials')
    }

    const token = await authService.createAccessToken(user)

    return response.json({
      token: token,
      user: userTransformer(user),
    })
  }

  public async forgetPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgetPasswordValidator)

    const user = await userService.find('email', email)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    await authService.sendAndSaveResetPasswordToken(user)

    return response.json({
      message: 'Verification link sent to registered email successfully!',
    })
  }

  public async resetPassword({ request, response }: HttpContext) {
    const { token, password } = await request.validateUsing(resetPasswordValidator)

    const tokenRecord = await userService.findResetPasswordToken('token', token)

    if (!tokenRecord) {
      throw new BadRequestException('Password reset link has expired. Please try again.')
    }

    const user = await userService.find('email', tokenRecord.email)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (token && password) {
      const existsAndValid = await userService.checkForTokenExpiration(token)

      if (existsAndValid) {
        const isSamePassword = await userService.isSamePassword(user.password, password)

        if (isSamePassword) {
          throw new BadRequestException('New password must be different from your current password')
        }

        await userService.updatePassword(user, password)

        await userService.deleteResetToken(user.email)

        return response.json({
          message: 'Password reset successfully',
        })
      } else {
        throw new BadRequestException('Password reset link has expired. Please try again.')
      }
    }
  }

  public async verifyEmail({ request, response }: HttpContext) {
    const { code } = await request.validateUsing(verifyEmailValidator)

    const emailVerificationCode = await emailVerificationService.findByCode(+code)
    const isExpired = emailVerificationService.isExpired(emailVerificationCode)
    const isValid = emailVerificationService.isValid(emailVerificationCode)
    const isUsed = emailVerificationService.isUsed(emailVerificationCode)

    if (isUsed) {
      throw new Exception('Email already verified!', { status: StatusCodes.CREATED })
    }

    if (isExpired) {
      throw new Exception('This Code is Expired, request a new code!', {
        status: StatusCodes.LOCKED,
      })
    }

    if (!emailVerificationCode || !isValid) {
      throw new InvalidCredentialsException('Invalid code!')
    }

    await emailVerificationService.update(emailVerificationCode.id, {
      isUsed: true,
      expiresAt: DateTime.now(),
    })

    await userService.update(emailVerificationCode.userId, { emailVerified: true })

    return response.ok({ success: true })
  }

  async sendEmailVerificationCode({ response, user }: HttpContext) {
    if (!user) {
      throw new UnAuthenticatedException('User not found!')
    }
    if (user.emailVerified) {
      throw new Exception('User already verified', { status: StatusCodes.CONFLICT })
    }
    const { success, message } =
      await emailVerificationService.generateAndSendVerificationCode(user)
    response.json({ success, message })
  }

  async logout({ user, response }: HttpContext) {
    await User.accessTokens.delete(user, user.currentAccessToken!.identifier)

    return response.json({ message: 'Logged-out successfully.' })
  }

  async googleLogin({ request, response }: HttpContext) {
    const { token } = await request.validateUsing(googleLoginValidator)

    const { email, given_name, name, picture, verified_email } =
      await oauthService.getGoogleUserInfo(token)
    const userData: UserCreateDTO = {
      email,
      firstName: spiltName(name).firstName,
      lastName: spiltName(name).lastName,
      emailVerified: verified_email,
      avatarUrl: picture,
      cognitoSub: token,
      displayName: given_name,
    }
    const user = await userService.findByEmailOrCreate(userData)
    const accessToken = await authService.createAccessToken(user)
    return response.json({
      token: accessToken,
      user: userTransformer(user),
    })
  }
}
