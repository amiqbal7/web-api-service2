import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { UpdateValidator } from '../Validators/Info'
import Admin from 'App/Models/Admin'

const guard = 'admin'

/**
 * Profile Information controller
 */
export default class Info {
  /**
   * Get profile information
   */
  public async show ({ auth, response }: HttpContextContract) {
    await auth.use(guard).authenticate()
    // Get user
    const user = auth.use(guard).user as Admin

    return response.ok(user.serialize())
  }

  /**
   * Update profile information
   */
  public async update ({ auth, request, response }: HttpContextContract) {
    await auth.use(guard).authenticate()
    // Get user
    const user = auth.use(guard).user as Admin
    // Validation request
    const payload = await request.validate(UpdateValidator)

    // Update user
    await user.merge({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      avatar: payload.avatar ? Attachment.fromFile(payload.avatar) : null,
    }).save()

    return response.ok({
      message: 'Your profile has been updated.',
    })
  }
}
