import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import AppBaseModel from './app_base_model.js'

export default class Country extends AppBaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare name: string

  @column()
  declare currencyCode: string

  @column()
  declare phonePrefix: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
