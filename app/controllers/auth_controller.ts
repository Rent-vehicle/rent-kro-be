import BadRequestException from '#exceptions/bad_request_exception.ts'
import InvalidCredentialsException from '#exceptions/invalid_credentials_exception'
import ModelAlreadyExistsException from '#exceptions/model_already_exists_exception'
import NotFoundException from '#exceptions/not_found_exception'
import User from '#models/user'
import { authService } from '#services/entities/auth.service'
import { userService } from '#services/entities/user.service'
import { HttpContext } from '@adonisjs/core/http'
import { userTransformer } from '../transformer/user/user_base_transformer.js'
import {
  forgetPasswordValidator,
  loginValidator,
  resetPasswordValidator,
  signupValidator,
} from '../validator/auth_validator.js'

export default class AuthController {
  public async signup({ request, response }: HttpContext) {
    const { ...sanitizedData } = await request.validateUsing(signupValidator)
    const user = await authService.findByEmail(sanitizedData.email)
    if (user) {
      throw new ModelAlreadyExistsException('User already exists with this email!')
    }

    const newUser = await userService.createUser(sanitizedData)
    const token = await authService.createAccessToken(newUser)

    return response.json({
      user: userTransformer(newUser),
      token: token,
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

    await authService.saveResetPasswordToken(user)

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

  async logout({ user, response }: HttpContext) {
    await User.accessTokens.delete(user, user.currentAccessToken!.identifier)

    return response.json({ message: 'Logged-out successfully.' })
  }
}
