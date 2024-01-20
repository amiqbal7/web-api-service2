import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { OrderCourier, OrderStatus } from 'App/Enums'
import OrderType from 'App/Enums/OrderType'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('company').notNullable()
      table.string('email').notNullable()
      table.string('address').notNullable()
      table.string('phone', 50).notNullable()
      table.string('dicom').notNullable()
      table.json('stl')
      table.enum('type', Object.values(OrderType)).notNullable()
      table.text('note')
      table.enum('status', Object.values(OrderStatus)).notNullable().defaultTo(OrderStatus.PENDING)
      table.decimal('price', 15, 2)
      table.json('receipt')
      table.enum('courier_type', Object.values(OrderCourier)).defaultTo(OrderCourier.JNT)
      table.decimal('courier_gosend_price', 15, 2)
      table.decimal('courier_jnt_price', 15, 2)
      table.string('courier_track_number')
      table.enum('review_rate', [1,2,3,4,5])
      table.text('review_message')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
