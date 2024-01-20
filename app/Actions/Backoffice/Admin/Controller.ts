import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { bind } from '@adonisjs/route-model-binding'
import Admin from 'App/Models/Admin'
import { IndexValidator, StoreValidator } from './Validator'
import SendDataAdmin from 'App/Notifications/SendDataAdmin'

export default class Controller {
  public async index ({ request, response }: HttpContextContract) {
    // Validation request
    const payload = await request.validate(IndexValidator)

    const page = payload.page || 1
    const limit = payload.limit || 10
    const orderBy = payload.orderBy || 'created_at'
    const orderType = payload.orderType || 'desc'

    const json = await Admin
      .query()
      .apply((scopes) => scopes.filters(payload.filters))
      .withScopes((scopes) => scopes.dateRange(payload.startDate, payload.endDate))
      .orderBy(orderBy, orderType)
      .paginate(page, limit)

    return response.ok(json)
  }

  /**
   * Create a new admin
   */
  public async store ({ request, response }: HttpContextContract) {
    // Validation request
    const payload = await request.validate(StoreValidator)

    // Dump password
    const password = Math.random().toString(36).slice(-8)
    // Create admin
    const admin = await Admin.create({
      ...payload,
      password,
    })

    // Send data to email
    admin.notifyLater(new SendDataAdmin(password))

    return response.created(admin?.serialize())
  }

  /**
   * Show specific admin
   */
  @bind()
  public async show ({ response }: HttpContextContract, admin: Admin) {
    return response.ok(admin.serialize())
  }
}

