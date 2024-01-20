import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Notifications extends BaseSchema {
  protected tableName = 'notifications'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title', 255).notNullable()
      table.string('description', 255).notNullable()
      table.timestamp('read_at', { useTz: true })
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
