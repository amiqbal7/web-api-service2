import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Admin from 'App/Models/Admin'
import { StoreValidator } from '../Validators/Register'

/**
 * Register Controller
 */
export default class Register {
  /**
   * Create new a user
   */
  public async store ({ request, response }: HttpContextContract) {
    // Validation request
    const payload = await request.validate(StoreValidator)
    // Register user
    const user = await Admin.create({
      ...payload,
      avatar: payload.avatar ? Attachment.fromFile(payload.avatar) : null,
    })

    Event.emit('auth:register', user)

    return response.created({
      message: 'We have emailed your email verification link.',
    })
  }
}
