import logger from '@adonisjs/core/services/logger'
import axios from 'axios'

interface UserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
}

class OAuthService {
  public static getInstance(): OAuthService {
    return new OAuthService()
  }

  public async getGoogleUserInfo(token: string): Promise<UserInfo> {
    try {
      logger.info({ token }, '[Verifying Google token and fetching user info...]')
      const url = 'https://www.googleapis.com/oauth2/v2/userinfo'
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status !== 200 || !res.data) {
        throw new Error('Invalid response from Google API')
      }
      return res.data
    } catch (error) {
      logger.error({ error, token }, '[Error verifying Google token]')
      throw new Error('Failed to verify Google token')
    }
  }
}
export const oauthService = OAuthService.getInstance()
