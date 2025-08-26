import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('cognito_sub').unique().notNullable()
      table.string('email').notNullable().unique()
      table.string('phone').nullable()
      table.boolean('phone_verified').defaultTo(false)
      table.boolean('email_verified').defaultTo(false)
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('display_name').nullable()
      table.string('password').nullable() // Nullable for social login users
      table.string('avatar_url').nullable()
      table.date('date_of_birth').nullable()
      table.string('gender').nullable()
      table.string('status').defaultTo('pending_verification')
      table.string('preferred_language', 2).defaultTo('en')
      table.integer('preferred_city_id').references('id').inTable('cities').nullable()
      table.json('emergency_contact').nullable()
      table.timestamp('last_active_at').nullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
