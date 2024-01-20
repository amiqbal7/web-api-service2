import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Admin from 'App/Models/Admin'
import { UpdateValidator } from '../Validators/Profile'

/**
 * Profile controller
 */
export default class Profile {
  /**
   * Get profile
   */
  public async show ({ auth, response }: HttpContextContract) {
    await auth.use('admin').authenticate()
    // Get user
    const user = auth.use('admin').user

    return response.ok(user?.serialize())
  }

  /**
   * Update profile
   */
  public async store ({ auth, request, response }: HttpContextContract) {
    await auth.use('admin').authenticate()
    // Get user
    const user = auth.use('admin').user as Admin
    // Validation request
    const payload = await request.validate(UpdateValidator)

    // Update user
    await user.merge({
      ...payload,
      avatar: payload.avatar ? Attachment.fromFile(payload.avatar) : null,
    }).save()

    return response.ok({ message: 'Your profile has been updated.' })
  }
}
