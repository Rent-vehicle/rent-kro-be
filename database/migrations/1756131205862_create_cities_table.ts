import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('state_id')
        .unsigned()
        .references('id')
        .inTable('states')
        .notNullable()
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('slug').notNullable()
      table.string('timezone').notNullable()
      table.float('latitude').notNullable()
      table.float('longitude').notNullable()
      table.boolean('is_active').defaultTo(false)
      table.timestamp('launch_date').nullable()
      table.json('meta').nullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
