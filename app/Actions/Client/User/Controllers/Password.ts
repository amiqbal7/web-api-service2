import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
import { UpdateValidator } from '../Validators/Password'

/**
 * Password controller
 */
export default class Password {
  /**
   * Update password
   */
  public async store ({ auth, request, response }: HttpContextContract) {
    await auth.use('client').authenticate()
    // Get user
    const user = auth.use('client').user as User
    // Validation request
    const { password, current_password: currentPassword } = await request.validate(UpdateValidator)

    if (!await Hash.verify(user.password, currentPassword)) {
      return response.badRequest({
        message: 'Your current password is incorrect',
      })
    }

    // Update password
    await user.merge({ password }).save()

    return response.ok({ message: 'Your password has been updated.' })
  }
}
