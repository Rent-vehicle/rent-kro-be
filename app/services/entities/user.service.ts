import { UserCreateDTO, UserUpdateDTO } from '#models/dto/user/user'
import ResetPasswordToken from '#models/reset_password_token'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'

class UserService {
  public static getInstance() {
    return new UserService()
  }

  public async verifyCredentials(email: string, password: string): Promise<User | null> {
    return await User.verifyCredentials(email, password)
  }

  public async createUser(userData: UserCreateDTO): Promise<User> {
    return await User.create({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
    })
  }

  public async find(field: string, value: string | number): Promise<User | null> {
    return await User.query().where(field, value).first()
  }

  public async isSamePassword(oldPassword: string, password: string): Promise<boolean> {
    return await hash.verify(oldPassword, password)
  }

  public async generateToken(data: string): Promise<string> {
    return crypto
      .createHash('sha256')
      .update(data + DateTime.now().toString())
      .digest('hex')
  }

  public async updateResetPasswordToken(
    resetPasswordToken: ResetPasswordToken,
    token: string
  ): Promise<void> {
    resetPasswordToken.token = token
    resetPasswordToken.expiresAt = DateTime.now().plus({ hours: 1 })
    await resetPasswordToken.save()
  }

  public async createResetPasswordToken(token: string, email: string): Promise<ResetPasswordToken> {
    return await ResetPasswordToken.create({
      token,
      email,
      expiresAt: DateTime.now().plus({ hours: 1 }),
    })
  }

  async findResetPasswordToken(field: string, value: string): Promise<ResetPasswordToken | null> {
    return await ResetPasswordToken.query().where(field, value).first()
  }

  async checkForTokenExpiration(token: string): Promise<boolean> {
    const tokenRecord = await this.findResetPasswordToken('token', token)
    if (tokenRecord) {
      const expiresAt = DateTime.fromISO(tokenRecord.expiresAt.toString())
      return expiresAt > DateTime.now()
    } else {
      return false
    }
  }

  async deleteResetToken(email: string) {
    return ResetPasswordToken.query().where({ email }).delete()
  }

  async update(id: number, data: UserUpdateDTO): Promise<User> {
    await User.query().where('id', id).update(data)
    const updatedUser = (await this.find('id', id)) as User
    return updatedUser
  }

  async updatePassword(user: User, password: string) {
    user.password = password
    user.save()
  }
}

export const userService = UserService.getInstance()
