import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { bind } from '@adonisjs/route-model-binding'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import User from 'App/Models/User'
import Order from 'App/Models/Order'
import { StoreValidator, IndexValidator, ConfirmValidator, ReceiptValidator, ReviewValidator } from './Validator'
import { OrderStatus } from 'App/Enums'
import puppeteer from 'puppeteer'
import mjml from 'mjml'

/**
 * Order Controller
 */
export default class Controller {
  /**
   * Display list orders
   */
  public async index ({ auth, request, bouncer, response }: HttpContextContract) {
    await auth.use('client').authenticate()
    // Get user
    const user = auth.use('client').user as User
    await bouncer.forUser(user).with('OrderPolicy').authorize('viewList')
    // Validation request
    await request.validate(IndexValidator)

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const filters = request.input('filters', {})

    const orders = await user
      .related('orders')
      .query()
      .orderBy('created_at', 'desc')
      .apply((scopes) => scopes.filters(filters))
      .paginate(page, limit)

    return response.ok(orders)
  }

  /**
   * Create a new order
   */
  public async store ({ request, auth, bouncer, response }: HttpContextContract) {
    await auth.use('client').authenticate()
    // Get user
    const user = auth.use('client').user as User
    await bouncer.forUser(user).with('OrderPolicy').authorize('create')
    // Validation request
    const payload = await request.validate(StoreValidator)

    // Create order
    const order = await user
      .related('orders')
      .create({
        ...payload,
        status: OrderStatus.PENDING,
      })

    return response.created(order?.serialize())
  }

  /**
   * Get order on progress
   */
  public async progress ({ auth, response }: HttpContextContract) {
    await auth.use('client').authenticate()
    // Get user
    const user = auth.use('client').user as User

    // Create order
    const order = await user
      .related('orders')
      .query()
      .whereNotIn('status', [OrderStatus.COMPLETE, OrderStatus.CANCEL])
      .first()

    if (!order) {
      return response.notFound({
        message: 'There are no progress orders.',
      })
    }

    return response.ok(order?.serialize())
  }

  /**
   * Show specific order
   */
  @bind()
  public async show ({ auth, bouncer, response }: HttpContextContract, order: Order) {
    await auth.use('client').authenticate()
    // Get user
    const user = auth.use('client').user as User
    await bouncer.forUser(user).with('OrderPolicy').authorize('view', order)

    return response.ok(order.serialize())
  }

  /**
   * Invoice specific order
   */
  @bind()
  public async invoice ({ auth, bouncer, response, view }: HttpContextContract, order: Order) {
    await auth.use('client').authenticate()
    // Get user
    const user = auth.use('client').user as User
    await bouncer.forUser(user).with('OrderPolicy').authorize('invoice', order)
    await order.load('user')

    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    await page.setContent(mjml(await view.render('invoice', { order })).html, {
      timeout: 0,
      waitUntil: 'networkidle0',
    })
    const pdf = await page.pdf({
      path: `invoice-${order.number}.pdf`,
      format: 'letter',
    })
    await browser.close()

    response.type('application/pdf')
    response.attachment(`invoice-${order.number}.pdf`)
    return response.send(pdf)
  }

  /**
   * Confirm specific order
   */
  @bind()
  public async confirm ({ request, auth, bouncer, response }: HttpContextContract, order: Order) {
    await auth.use('client').authenticate()
    // Get user
    const user = auth.use('client').user as User
    await bouncer.forUser(user).with('OrderPolicy').authorize('view', order)
    // Validation request
    const payload = await request.validate(ConfirmValidator)
    if (!payload.terms) {
      return response.badRequest({
        message: 'The terms must be accepted.',
      })
    }
    // update order status, courier type
    await order.merge({
      status: OrderStatus.RECEIPT,
      courierType: payload.courier,
    }).save()

    return response.created({
      message: 'Order was confirm',
    })
  }

  /**
   * Cancel specific order
   */
  @bind()
  public async cancel ({ auth, bouncer, response }: HttpContextContract, order: Order) {
    await auth.use('client').authenticate()
    // Get user
    const user = auth.use('client').user as User
    await bouncer.forUser(user).with('OrderPolicy').authorize('view', order)
    // update order status
    await order.merge({ status: OrderStatus.CANCEL }).save()

    return response.created({
      message: 'Order was cancel',
    })
  }

  /**
   * Upload receipt specific order
   */
  @bind()
  public async receipt ({ request, auth, bouncer, response }: HttpContextContract, order: Order) {
    await auth.use('client').authenticate()
    // Get user
    const user = auth.use('client').user as User
    await bouncer.forUser(user).with('OrderPolicy').authorize('view', order)
    // Validation request
    const { file } = await request.validate(ReceiptValidator)
    // update order receipt
    await order.merge({ receipt: Attachment.fromFile(file) }).save()

    return response.created({
      message: 'Order receipt updated',
    })
  }

  /**
   * Delivery specified order
   */
  @bind()
  public async delivery ({ auth, bouncer, response }: HttpContextContract, order: Order) {
    await auth.use('client').authenticate()
    // Get user
    const user = auth.use('client').user as User
    await bouncer.forUser(user).with('OrderPolicy').authorize('view', order)
    // update order status
    await order.merge({ status: OrderStatus.REVIEW }).save()

    return response.created({
      message: 'Order delivery updated',
    })
  }

  /**
   * Review specified order
   */
  @bind()
  public async review ({ request, auth, bouncer, response }: HttpContextContract, order: Order) {
    await auth.use('client').authenticate()
    // Get user
    const user = auth.use('client').user as User
    await bouncer.forUser(user).with('OrderPolicy').authorize('view', order)
    // Validation request
    const { rate, message } = await request.validate(ReviewValidator)
    // update order review
    await order.merge({
      status: OrderStatus.COMPLETE,
      reviewRate: rate,
      reviewMessage: message,
    }).save()

    return response.created({
      message: 'Order review updated',
    })
  }
}
