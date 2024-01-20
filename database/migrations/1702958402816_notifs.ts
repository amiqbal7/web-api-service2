import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'notifs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('title', 255).notNullable()
      table.string('description', 255).notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('read_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
