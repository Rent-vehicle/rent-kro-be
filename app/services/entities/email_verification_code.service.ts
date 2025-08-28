import EmailVerificationCode from '#models/email_verification_code'
import User from '#models/user'
import { emailService } from '#services/factories/email.service'
import { DateTime } from 'luxon'
import {
  EmailVerificationCodeCreateDTO,
  EmailVerificationCodeUpdateDTO,
} from '../../constants/dto/email_verification_code/email_verification_code.js'
import { loadEmailTemplate } from '../../utils/helpers.js'
import { BUSINESS_NAME, FE_BASE_URL, SENDER_MAIL_NAME, SUPPORT_EMAIL } from '../../utils/secret.js'

class EmailVerification {
  public static getInstance() {
    return new EmailVerification()
  }

  public findById = async (id: number) => {
    return await EmailVerificationCode.find(id)
  }

  public findByCode = async (code: number) => {
    return EmailVerificationCode.query().where('code', code).first()
  }

  public findByUserId = async (userId: number) => {
    return EmailVerificationCode.query().where('userId', userId).first()
  }

  public update = async (
    id: number,
    data: EmailVerificationCodeUpdateDTO
  ): Promise<EmailVerificationCode> => {
    await EmailVerificationCode.query().update(data).where('id', id).first()

    return (await this.findById(id)) as EmailVerificationCode
  }

  public updateExpiredCodesToNew = async (id: number) => {
    const newCode = await this.generateUniqueVerificationCode()
    const updated = this.update(id, {
      code: newCode,
      expiresAt: DateTime.now().plus({ minutes: 5 }),
    })
    return updated
  }

  public create = async (data: EmailVerificationCodeCreateDTO) => {
    const emailVerificationCode = await EmailVerificationCode.create(data)
    return emailVerificationCode
  }

  public createNewCodeForUser = async (userId: number) => {
    const code = await this.generateUniqueVerificationCode()
    const emailVerificationCode = await this.create({
      userId,
      code,
    })
    return emailVerificationCode
  }

  public async generateUniqueVerificationCode(): Promise<number> {
    let code = Math.floor(100000 + Math.random() * 900000)
    let exists = true

    while (exists) {
      code = Math.floor(100000 + Math.random() * 900000)
      exists = !!(await this.findByCode(code))
    }

    return code
  }

  public async generateAndSendVerificationCode(user: User) {
    try {
      // Fetch verification code if it exists
      let emailVerificationCode = await emailVerificationService.findByUserId(user.id)
      let code: number

      if (emailVerificationCode) {
        const isExpired = emailVerificationService.isExpired(emailVerificationCode)

        if (isExpired) {
          emailVerificationCode = await emailVerificationService.updateExpiredCodesToNew(
            emailVerificationCode.id
          )
          console.log(
            'emailVerificationCode-----------=====================',
            emailVerificationCode
          )
          code = emailVerificationCode.code
        } else {
          // Still valid → maybe extend expiry if close to expiring
          const expiresAt = new Date(emailVerificationCode.expiresAt.toString())
          const minutesLeft = DateTime.fromJSDate(expiresAt).diffNow('minutes').minutes

          if (minutesLeft < 1) {
            emailVerificationCode = await this.update(emailVerificationCode.id, {
              expiresAt: DateTime.now().plus({ minutes: 5 }),
            })
          }

          code = emailVerificationCode.code
        }
      } else {
        // No code exists → create new one
        emailVerificationCode = await emailVerificationService.createNewCodeForUser(user.id)
        code = emailVerificationCode.code
      }
      console.log('=================================code is ', code)

      const { success, message } = await this.sendEmailVerificationCode(user, code)
      return { success, message }
    } catch (error) {
      console.error('Error generating or saving verification code:', error)
      return { message: 'Failed to generate or send verification code', success: false, error }
    }
  }

  public sendEmailVerificationCode = async (user: User, code: number) => {
    try {
      const htmlContent = loadEmailTemplate('email_verification', {
        code: code?.toString() ?? '',
        name: user.firstName,
        expiryMinutes: '5',
        supportEmail: SUPPORT_EMAIL,
        businessName: BUSINESS_NAME,
        verificationUrl: `${FE_BASE_URL}/auth/verify-email/code=${code}`,
      })
      const response = emailService.sendEmailUsingNodemailer({
        from: SENDER_MAIL_NAME,
        to: user.email,
        subject: 'Your Email Verification Code',
        html: htmlContent,
      })
      return { message: 'Verification code sent successfully', success: true, response }
    } catch (error) {
      console.error('Error generating or saving verification code:', error)
      return { message: 'Failed to send verification code', success: false, error }
    }
  }

  public isExpired(emailVerification: EmailVerificationCode | null): boolean {
    if (!emailVerification) return true

    console.log()
    return emailVerification.expiresAt <= DateTime.now()
  }

  public isUsed(emailVerification: EmailVerificationCode | null): boolean {
    if (!emailVerification) return false
    return emailVerification.isUsed
  }

  public isValid(emailVerification: EmailVerificationCode | null): boolean {
    if (!emailVerification) return false
    return !this.isExpired(emailVerification) && !this.isUsed(emailVerification)
  }
}

export const emailVerificationService = EmailVerification.getInstance()
