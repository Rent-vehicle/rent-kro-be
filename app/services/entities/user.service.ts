import ResetPasswordToken from '#models/reset_password_token'
import User from '#models/user'
import redisService from '#services/factories/redis.service'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import { UserCreateDTO, UserUpdateDTO } from '../../constants/dto/user/user.js'

class UserService {
  public static getInstance() {
    return new UserService()
  }

  private REDIS_KEYS = {
    USER_BY_EMAIL: (email: string) => `user:email:${email.toLowerCase()}`,
    USER_BY_ID: (id: number) => `user:id:${id}`,
    USER_BY_PHONE: (phone: string) => `user:phone:${phone}`,
    USER_BY_FIELD: (field: string, value: string | number) => `user:${field}:${value}`,
  }
  private REDIS_TTL = 1 * 60 // 1 minutes

  public async verifyCredentials(email: string, password: string): Promise<User | null> {
    return await User.verifyCredentials(email, password)
  }

  public findById(id: number): Promise<User | null> {
    return User.find(id)
  }

  public findByEmail(email: string): Promise<User | null> {
    return User.query().whereRaw('LOWER(email) = ?', [email?.toLowerCase()]).first()
  }

  public findByResetToken(token: string): Promise<ResetPasswordToken | null> {
    return ResetPasswordToken.query().where('token', token).first()
  }

  public async findByPhone(phone: string): Promise<User | null> {
    return User.query().where('phone', phone).first()
  }

  public findCacheById(id: number): Promise<User | null> {
    return redisService.getOrSet(
      this.REDIS_KEYS.USER_BY_ID(id),
      async () => {
        return await this.findById(id)
      },
      this.REDIS_TTL
    )
  }
  public findCacheByEmail(email: string): Promise<User | null> {
    return redisService.getOrSet(
      this.REDIS_KEYS.USER_BY_EMAIL(email),
      async () => {
        return await this.findByEmail(email)
      },
      this.REDIS_TTL
    )
  }
  public findCacheByPhone(phone: string): Promise<User | null> {
    return redisService.getOrSet(
      this.REDIS_KEYS.USER_BY_PHONE(phone),
      async () => {
        return await this.findByPhone(phone)
      },
      this.REDIS_TTL
    )
  }

  public async createUser(userData: UserCreateDTO): Promise<User> {
    const user = await User.create({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
    })
    redisService.set(this.REDIS_KEYS.USER_BY_ID(user.id), user, this.REDIS_TTL)
    return user
  }

  public async deleteUser(id: number) {
    const user = await this.findById(id)
    if (!user) {
      return 0
    }
    redisService.del(this.REDIS_KEYS.USER_BY_ID(id))
    redisService.del(this.REDIS_KEYS.USER_BY_EMAIL(user.email))
    redisService.del(this.REDIS_KEYS.USER_BY_PHONE(user.phoneNumber))

    return User.query().where('id', id).delete()
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
    redisService.set(this.REDIS_KEYS.USER_BY_ID(id), updatedUser, this.REDIS_TTL)
    return updatedUser
  }

  async updatePassword(user: User, password: string) {
    user.password = password
    user.save()
  }
}

export const userService = UserService.getInstance()
