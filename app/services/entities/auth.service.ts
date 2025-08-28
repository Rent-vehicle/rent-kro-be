import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import User from '#models/user'
import { emailService } from '#services/factories/email.service'
import { FE_BASE_URL } from '../../utils/secret.js'
import { userService } from './user.service.js'

class AuthService {
  public static getInstance() {
    return new AuthService()
  }

  public async findByEmail(email: string): Promise<User | null> {
    return User.query().whereRaw('LOWER(email) = ?', [email?.toLowerCase()]).first()
  }

  public async createAccessToken(user: User, expiry?: string): Promise<string | undefined> {
    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: expiry || '2 days',
    })
    return token.value?.release()
  }

  public async sendAndSaveResetPasswordToken(user: User) {
    const generatedToken = await userService.generateToken(user.email + user.firstName)
    const resetPasswordToken = await userService.findResetPasswordToken('email', user.email)

    if (resetPasswordToken) {
      await userService.updateResetPasswordToken(resetPasswordToken, generatedToken)
    } else {
      await userService.createResetPasswordToken(generatedToken, user.email)
    }

    const redirectLink = `${FE_BASE_URL}/auth/reset-password?token=${generatedToken}`

    try {
      await emailService.sendResetPasswordEmail(
        { email: user.email, name: user.firstName + ' ' + user.lastName },
        redirectLink
      )
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to send password reset email. Please try again later.'
      )
    }
  }
}

export const authService = AuthService.getInstance()
