import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { bind } from '@adonisjs/route-model-binding'
import Vendor from 'App/Models/Vendor'
import { IndexValidator, StoreValidator } from './Validator'

export default class Controller {
  /**
   * Display list vendors
   */
  public async index ({ request, response }: HttpContextContract) {
    // Validation request
    const payload = await request.validate(IndexValidator)

    const page = payload.page || 1
    const limit = payload.limit || 10
    const orderBy = payload.orderBy || 'created_at'
    const orderType = payload.orderType || 'desc'

    const json = await Vendor
      .query()
      .apply((scopes) => scopes.filters(payload.filters))
      .withScopes((scopes) => scopes.dateRange(payload.startDate, payload.endDate))
      .orderBy(orderBy, orderType)
      .paginate(page, limit)

    return response.ok(json)
  }

  /**
   * Create a new vendor
   */
  public async store ({ request, response }: HttpContextContract) {
    // Validation request
    const payload = await request.validate(StoreValidator)
    // Create vendor
    const vendor = await Vendor.create(payload)

    return response.created(vendor?.serialize())
  }

  /**
   * Show specific vedor
   */
  @bind()
  public async show ({ response }: HttpContextContract, vendor: Vendor) {
    return response.ok(vendor.serialize())
  }
}
