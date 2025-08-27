import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { beforeSave, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import AppBaseModel from './app_base_model.js'
import { USER_STATUS_ENUM } from '../constants/enums/user.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(AppBaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cognitoSub: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare phoneNumber: string

  @column()
  declare emailVerified: boolean

  @column()
  declare phoneNumberVerified: boolean

  @column()
  declare displayName: string

  @column()
  declare avatarUrl: string

  @column()
  declare dateOfBirth: DateTime

  @column()
  declare gender: string

  @column()
  declare status: USER_STATUS_ENUM

  @column()
  declare preferredLanguage: string

  @column()
  declare preferredCityId: number

  @column()
  declare emergencyContact: Object // {name, phone, relationship}

  @column()
  declare lastActiveAt: DateTime

  @column()
  declare deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeSave()
  static async normalizeEmail(user: User) {
    if (user.$dirty.email) {
      user.email = user.email.toLowerCase()
    }
  }

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '10 days',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  currentAccessToken?: AccessToken
}
