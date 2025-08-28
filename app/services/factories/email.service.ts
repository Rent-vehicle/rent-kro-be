import nodemailer from 'nodemailer'
import { loadEmailTemplate } from '../../utils/helpers.js'
import {
  MAIL_APP_PASSWORD,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_SECURE,
  SENDER_MAIL,
} from '../../utils/secret.js'

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
      console.log('Sending email using Nodemailer...', options)
      const response = await this.transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      })
      console.log('Email sent successfully using Nodemailer:', response)
      return response
    } catch (error) {
      console.error('Error sending email using Nodemailer:', error)
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
      from: SENDER_MAIL,
      to: user.email,
      subject: 'Reset Your Password - Rent Karo',
      html: htmlBody,
    })
  }

  // async sendResetPasswordEmail(user: { name: string; email: string }, redirectLink: string) {
  //   const htmlBody = `
  //     <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
  //       <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
  //         <h2 style="color: #333; text-align: center;">Hello, ${user.name}</h2>
  //         <p style="font-size: 16px; color: #555; text-align: center;">You requested to reset your password for <strong>Diara</strong>.</p>
  //         <p style="font-size: 16px; color: #555; text-align: center;">Click the button below to reset your password:</p>
  //         <div style="text-align: center; margin: 20px 0;">
  //           <a href="${redirectLink}" style="background: #007bff; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
  //             Reset Password
  //           </a>
  //         </div>
  //         <p style="font-size: 14px; color: #999; text-align: center;">Best Regards,<br/>Diara Team</p>
  //       </div>
  //     </div>
  //   `

  //   await this.client.sendEmail({
  //     From: POSTMARK_EMAIL,
  //     To: user.email,
  //     Subject: 'Reset Your Password - Diara',
  //     HtmlBody: htmlBody,
  //   })
  // }
}

export const emailService = EmailService.getInstance()
