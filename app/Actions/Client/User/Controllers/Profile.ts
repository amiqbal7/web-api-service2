import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import User from 'App/Models/User'
import { UpdateValidator } from '../Validators/Profile'

/**
 * Profile controller
 */
export default class Profile {
  /**
   * Get profile
   */
  public async show ({ auth, response }: HttpContextContract) {
    await auth.use('client').authenticate()
    // Get user
    const user = auth.use('client').user

    return response.ok(user?.serialize())
  }

  /**
   * Update profile
   */
  public async store ({ auth, request, response }: HttpContextContract) {
    await auth.use('client').authenticate()
    // Get user
    const user = auth.use('client').user as User
    // Validation request
    const payload = await request.validate(UpdateValidator)

    // Update user
    await user.merge({
      name: payload.name,
      email: payload.email,
      address: payload.address,
      gender: payload.gender,
      company: payload.company,
      phone: payload.phone,
      avatar: payload.avatar ? Attachment.fromFile(payload.avatar) : null,
    }).save()

    return response.ok({ message: 'Your profile has been updated.' })
  }
}
