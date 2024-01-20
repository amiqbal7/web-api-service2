import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Limiter } from '@adonisjs/limiter/build/services'
import Admin from 'App/Models/Admin'
import { StoreValidator, UpdateValidator } from '../Validators/ForgotPassword'
import SendPasswordReset from 'App/Notifications/SendPasswordReset'
import Token from 'App/Models/Token'
import TokenType from 'App/Enums/TypeToken'

/**
 * Forgot Password controller
 */
export default class ForgotPassword {
  /**
   * Send link request
   */
  public async store ({ request, response }: HttpContextContract) {
    // Validation request
    const { email } = await request.validate(StoreValidator)

    // Rate limit key
    const throttleKey = `forgotpassword_admin_${email}_${request.ip()}`
    // Create rate limit
    const limiter = Limiter.use({
      requests: 5,
      duration: '1 mins',
      blockDuration: '30 mins',
    })

    // Ensure the login request is not rate limited.
    if (await limiter.isBlocked(throttleKey)) {
      const throttle = await limiter.get(throttleKey)
      return response.tooManyRequests({ message: `Too many forgot password attempts. Please try again in ${Math.ceil((throttle?.retryAfter ?? 0)/60000)} minutes.` })
    }

    const user = await Admin.findBy('email', email)
    if (! user) {
      // Increment rate limit
      await limiter.increment(throttleKey)
      return response.notFound({ message: 'We can\'t find a user with that email address.' })
    }

    // Reset rate limit
    await limiter.delete(throttleKey)

    // Send forgot password
    user.notifyLater(new SendPasswordReset())

    return response.ok({ message: 'We have emailed your password reset link.' })
  }

  /**
   * Reset password
   */
  public async update ({ request, response }: HttpContextContract) {
    // Validation request
    const { token: tokenString, password } = await request.validate(UpdateValidator)

    // Get token by token string
    const token = await Token.getToken(tokenString, TokenType.PASSWORD_RESET)

    // If token not found
    if (!token) {
      return response.unauthorized({ message: 'This password reset token is invalid.' })
    }

    // Update password
    await token.user.merge({ password }).save()
    // Set token to expired
    await token.setExpired()

    return response.ok({ message: 'Your password has been reset.' })
  }
}
