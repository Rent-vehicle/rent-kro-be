import User from '#models/user'

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
}

export const authService = AuthService.getInstance()
