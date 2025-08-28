import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import AppBaseModel from './app_base_model.js'

export default class EmailVerificationCode extends AppBaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare code: number

  @column()
  declare isUsed: boolean

  /**
   * Expiration timestamp for the verification code
   * By default, set to 5 minutes from the creation time
   */
  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
