import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { bind } from '@adonisjs/route-model-binding'
import User from 'App/Models/User'
import { IndexValidator, StoreValidator } from './Validator'
import SendDataClient from 'App/Notifications/SendDataClient'

export default class Controller {
  /**
   * Display list clients
   */
  public async index ({ request, response }: HttpContextContract) {
    // Validation request
    await request.validate(IndexValidator)

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const filters = request.input('filters', {})

    const json = await User
      .query()
      .apply((scopes) => scopes.filters(filters))
      .paginate(page, limit)

    return response.ok(json)
  }

  /**
   * Create a new client
   */
  public async store ({ request, response }: HttpContextContract) {
    // Validation request
    const payload = await request.validate(StoreValidator)

    // Dump password
    const password = Math.random().toString(36).slice(-8)
    // Create client
    const client = await User.create({
      ...payload,
      password,
    })

    // Send data to email
    client.notifyLater(new SendDataClient(password))

    return response.created(client?.serialize())
  }

  /**
   * Show specific client
   */
  @bind()
  public async show ({ response }: HttpContextContract, client: User) {
    return response.ok(client.serialize())
  }
}
