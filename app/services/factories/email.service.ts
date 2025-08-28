import nodemailer from 'nodemailer'
import { loadEmailTemplate } from '../../utils/helpers.js'
import {
  MAIL_APP_PASSWORD,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_SECURE,
  SENDER_MAIL,
  SENDER_MAIL_NAME,
} from '../../utils/secret.js'
import logger from '@adonisjs/core/services/logger'

class EmailService {
  // private client: postmark.ServerClient
  private transporter: nodemailer.Transporter

  constructor() {
    // this.client = new postmark.ServerClient(POSTMARK_API_KEY)
    this.transporter = this.emailTransporter()
  }

  public static getInstance(): EmailService {
    return new EmailService()
  }

  private emailTransporter = () => {
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: MAIL_SECURE,
      auth: {
        user: SENDER_MAIL,
        pass: MAIL_APP_PASSWORD,
      },
    })
    return transporter
  }

  public sendEmailUsingNodemailer = async (options: {
    from: string
    to: string
    subject: string
    html: string
  }) => {
    try {
      logger.info({ data: options }, '[Sending email using Nodemailer...]')
      const response = await this.transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      })
      logger.info({ response }, '[Email sent successfully using Nodemailer]')
      return response
    } catch (error) {
      logger.error({ error }, '[Error while sending email using Nodemailer]')
      return error
    }
  }

  public sendResetPasswordEmail = async (
    user: { name: string; email: string },
    redirectLink: string
  ) => {
    const htmlBody = loadEmailTemplate('reset_password', {
      name: user.name,
      redirectLink,
    })
    this.sendEmailUsingNodemailer({
      from: SENDER_MAIL_NAME,
      to: user.email,
      subject: 'Reset Your Password - Rent Karo',
      html: htmlBody,
    })
  }
}

export const emailService = EmailService.getInstance()
