import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { bind } from '@adonisjs/route-model-binding'
import Admin from 'App/Models/Admin'
import { IndexValidator, StoreValidator } from './Validator'
import SendDataAdmin from 'App/Notifications/SendDataAdmin'

export default class Controller {
  /**
   * Display list admins
   *
   * @swagger
   * /admin/admins:
   *  get:
   *   tags:
   *    - Admin
   *   security: []
   *   summary: Returns a list of admins.
   *   description: Optional extended description in CommonMark or HTML.
   *   responses:
   *    200:
   *     description: A JSON array of user names
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         data:
   *          type: array
   *          items:
   *            type: object
   *         meta:
   *          type: object
   */
  public async index ({ request, response }: HttpContextContract) {
    // Validation request
    await request.validate(IndexValidator)

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const filters = request.input('filters', {})

    const json = await Admin
      .query()
      .apply((scopes) => scopes.filters(filters))
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
