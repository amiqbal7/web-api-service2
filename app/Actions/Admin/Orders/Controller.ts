import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { bind } from '@adonisjs/route-model-binding'
import Order from 'App/Models/Order'
import { IndexValidator, ConfirmValidator, DeliveryValidator } from './Validator'
import { OrderStatus, OrderType } from 'App/Enums'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default class Controller {
  /**
   * Summary orders
   */
  public async summary ({ response }: HttpContextContract) {
    const data = await Order
      .query()
      .count({
        total: '*',
      })
      .first()

    return response.ok({
      total: data?.$extras.total,
      confirm: 1,
      receipt: 0,
      build: 0,
      delivery: 0,
      review: 0,
    })
  }

  /**
   * Display list orders
   */
  public async index ({ request, response }: HttpContextContract) {
    // Validation request
    await request.validate(IndexValidator)

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const filters = request.input('filters', {})

    const json = await Order
      .query()
      .orderBy('created_at', 'desc')
      .apply((scopes) => scopes.filters(filters))
      .preload('user')
      .paginate(page, limit)

    return response.ok(json)
  }

  /**
   * Show specific order
   */
  @bind()
  public async show ({ response }: HttpContextContract, order: Order) {
    await order.load('user')

    return response.ok(order.serialize())
  }

  /**
   * Confirm specific order
   */
  @bind()
  public async confirm ({ request, response }: HttpContextContract, order: Order) {
    // Validation request
    const payload = await request.validate(ConfirmValidator)
    // update order status, price, courier price
    await order.merge({
      status: OrderStatus.CONFIRM,
      price: payload.price,
      courierJntPrice: payload.jnt_price,
      courierGosendPrice: payload.gosend_price,
    }).save()

    return response.created({
      message: 'Order was confirm',
    })
  }

  /**
   * Acc receipt specific order
   */
  @bind()
  public async receipt ({ response }: HttpContextContract, order: Order) {
    // update order status
    await order.merge({ status: OrderStatus.BUILD }).save()

    return response.created({
      message: 'Order was receipt',
    })
  }

  /**
   * Build specific order
   */
  @bind()
  public async build ({ response }: HttpContextContract, order: Order) {
    // update order status
    await order.merge({ status: OrderStatus.DELIVERY }).save()

    return response.created({
      message: 'Order was builded',
    })
  }

  /**
   * Delivery specific order
   */
  @bind()
  public async delivery ({ request, response }: HttpContextContract, order: Order) {
    // Validation request
    const payload = await request.validate(DeliveryValidator)
    if (order.type === OrderType.STL) {
      if (!payload.file) {
        return response.badRequest({
          message: 'Please a upload file stl',
        })
      } else {
        // add file stl
        await order.merge({ stl: Attachment.fromFile(payload.file) }).save()
      }
    } else {
      if (!payload.track_number) {
        return response.badRequest({
          message: 'Please input a track number',
        })
      } else {
        // update order status, courier track number
        await order.merge({
          courierTrackNumber: payload.track_number,
          status: payload.complete ? OrderStatus.REVIEW : OrderStatus.DELIVERY,
        }).save()
      }
    }

    return response.created({
      message: 'Order was delivery',
    })
  }
}
