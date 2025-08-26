import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'states'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('country_id')
        .unsigned()
        .references('id')
        .inTable('countries')
        .notNullable()
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('code', 3).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.unique(['country_id', 'code'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
