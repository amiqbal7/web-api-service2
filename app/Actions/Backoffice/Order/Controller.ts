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
    try {
      const pending = await Order.query()
        .where('status', 'pending')
        .count({
          total: '*',
        })
        .first()

      const confirm = await Order.query()
        .where('status', 'confirm')
        .count({
          total: '*',
        })
        .first()

      const receipt = await Order.query()
        .where('status', 'receipt')
        .count({
          total: '*',
        })
        .first()

      const build= await Order.query()
        .where('status', 'build')
        .count({
          total: '*',
        })
        .first()

      const review= await Order.query()
        .where('status', 'review')
        .count({
          total: '*',
        })
        .first()

      const cancel= await Order.query()
        .where('status', 'cancel')
        .count({
          total: '*',
        })
        .first()

      const complete= await Order.query()
        .where('status', 'complete')
        .count({
          total: '*',
        })
        .first()

      const delivery = await Order.query()
        .where('status', 'delivery')
        .count({
          total: '*',
        })
        .first()

      const total = await Order.query()
        .count({
          total: '*',
        })
        .first()

      return response.ok({
        confirm: confirm?.$extras.total ?? 0,
        pending: pending?.$extras.total ?? 0,
        receipt: receipt?.$extras.total ?? 0,
        build: build?.$extras.total ?? 0,
        complete: complete?.$extras.total ?? 0,
        delivery: delivery?.$extras.total ?? 0,
        review: review?.$extras.total ?? 0,
        total: total?.$extras.total ?? 0,
        cancel: cancel?.$extras.total ?? 0,
      })
    } catch (error) {
      console.error('Error fetching summary:', error.message)
      return response.status(500).send({ error: 'Internal Server Error' })
    }
  }

  /**
   * Display list orders
   */
  public async index ({ request, response }: HttpContextContract) {
    // Validation request
    const payload = await request.validate(IndexValidator)

    const page = payload.page || 1
    const limit = payload.limit || 10
    const orderBy = payload.orderBy || 'created_at'
    const orderType = payload.orderType || 'desc'

    const json = await Order
      .query()
      .preload('user')
      .apply((scopes) => scopes.filters(payload.filters))
      .withScopes((scopes) => scopes.dateRange(payload.startDate, payload.endDate))
      .orderBy(orderBy, orderType)
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

  @bind()
  public async cancel ({ response }: HttpContextContract, order: Order) {
    // update order status
    await order.merge({ status: OrderStatus.CANCEL }).save()

    return response.created({
      message: 'Order was cancel',
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

  @bind()
  public async delivered ({ response }: HttpContextContract, order: Order) {
    // update order status
    await order.merge({ status: OrderStatus.REVIEW }).save()

    return response.created({
      message: 'Order was delivered',
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

