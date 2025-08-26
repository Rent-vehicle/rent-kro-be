import postmark from 'postmark'
import { POSTMARK_API_KEY, POSTMARK_EMAIL } from '../../utils/secret.js'

class EmailService {
  private client: postmark.ServerClient

  constructor() {
    this.client = new postmark.ServerClient(POSTMARK_API_KEY)
  }

  public static getInstance(): EmailService {
    return new EmailService()
  }

  async sendResetPasswordEmail(user: { name: string; email: string }, redirectLink: string) {
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">Hello, ${user.name}</h2>
          <p style="font-size: 16px; color: #555; text-align: center;">You requested to reset your password for <strong>Diara</strong>.</p>
          <p style="font-size: 16px; color: #555; text-align: center;">Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${redirectLink}" style="background: #007bff; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 14px; color: #999; text-align: center;">Best Regards,<br/>Diara Team</p>
        </div>
      </div>
    `

    await this.client.sendEmail({
      From: POSTMARK_EMAIL,
      To: user.email,
      Subject: 'Reset Your Password - Diara',
      HtmlBody: htmlBody,
    })
  }
}

export const emailService = EmailService.getInstance()
