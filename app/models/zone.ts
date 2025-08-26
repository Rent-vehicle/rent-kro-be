import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import AppBaseModel from './app_base_model.js'

export default class Zone extends AppBaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cityId: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare polygon: string

  @column()
  declare zoneType: string // operational, restricted, premium, etc.

  //   @column()
  //   declare boundary: Object
  // declare it later

  @column()
  declare isActive: boolean

  @column()
  declare surgeMultiplier: DateTime

  @column()
  declare meta: Object

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
