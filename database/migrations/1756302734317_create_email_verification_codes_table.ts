import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'email_verification_codes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('code', 6).notNullable()
      table.boolean('is_used').defaultTo(false)
      table
        .timestamp('expires_at')
        .notNullable()
        .defaultTo(this.raw("CURRENT_TIMESTAMP + INTERVAL '5 minutes'"))

      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
      table.unique(['user_id'])
      table.unique(['code'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
