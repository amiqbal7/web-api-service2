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
    await request.validate(IndexValidator)

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const filters = request.input('filters', {})

    const json = await Vendor
      .query()
      .apply((scopes) => scopes.filters(filters))
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
