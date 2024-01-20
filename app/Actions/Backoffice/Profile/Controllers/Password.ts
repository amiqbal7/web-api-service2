import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import { UpdateValidator } from '../Validators/Password'
import Admin from 'App/Models/Admin'

const guard = 'admin'

/**
 * Profile Password controller
 */
export default class Password {
  /**
   * Update profile password
   */
  public async update ({ auth, request, response }: HttpContextContract) {
    await auth.use(guard).authenticate()
    // Get user
    const user = auth.use(guard).user as Admin
    // Validation request
    const { password, current_password: currentPassword } = await request.validate(UpdateValidator)

    if (!await Hash.verify(user.password, currentPassword)) {
      return response.badRequest({
        message: 'Your current password is incorrect',
      })
    }

    // Update password
    await user.merge({ password }).save()

    return response.ok({
      message: 'Your password has been updated.',
    })
  }
}
