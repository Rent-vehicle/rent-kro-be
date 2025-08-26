import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'zones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('city_id')
        .unsigned()
        .references('id')
        .inTable('cities')
        .notNullable()
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('slug').notNullable()
      table.float('latitude').notNullable()
      table.float('longitude').notNullable()
      table.boolean('is_active').defaultTo(false)
      table.float('surge_multiplier').nullable().defaultTo(1.0)
      table.json('meta').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.unique(['city_id', 'slug'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
