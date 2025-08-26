import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import AppBaseModel from './app_base_model.js'

export default class AppConfig extends AppBaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare key: string

  @column()
  declare value: Object

  @column()
  declare description: string

  @column()
  declare isSensitive: boolean

  @column()
  declare updatedBy: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
