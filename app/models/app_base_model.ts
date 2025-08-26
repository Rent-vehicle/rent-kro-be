import { BaseModel } from '@adonisjs/lucid/orm'
import Database from '@adonisjs/lucid/services/db'

export default class AppBaseModel extends BaseModel {
  static async exists(id: number | string): Promise<boolean> {
    try {
      // Use count query for efficient existence check
      const result = await Database.from(this.table).where('id', id).count('* as count').first()
      return (result?.count || 0) > 0
    } catch (error) {
      console.error('Error checking if user exists:', error)
      return false
    }
  }
}
