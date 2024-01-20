import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Order from 'App/Models/Order'
import { OrderStatus } from 'App/Enums'

export default class OrderPolicy extends BasePolicy {
  public async viewList (_user: User) {
    return true
  }

  public async view (user: User, order: Order) {
    return user.id === order.userId
  }

  public async invoice (user: User, order: Order) {
    return await this.view(user, order) && !!order.invoice
  }

  public async create (user: User) {
    const progress = await user.related('orders')
      .query()
      .whereNotIn('status', [OrderStatus.COMPLETE, OrderStatus.CANCEL])
      .first()

    return !progress
  }

  public async update (user: User, order: Order) {
    return await this.view(user, order)
  }

  public async delete (user: User, order: Order) {
    return await this.view(user, order)
  }
}
