import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UpdateValidator } from '../Validators/VerifyEmail'
import Token from 'App/Models/Token'
import TokenType from 'App/Enums/TypeToken'
import { DateTime } from 'luxon'
import SendEmailVerification from 'App/Notifications/SendEmailVerification'

/**
 * Verify Email controller
 */
export default class VerifyEmail {
  /**
   * Send link request
   */
  public async store ({ auth, response }: HttpContextContract) {
    const user = auth.use('client').user

    // Check user is email verified
    if (!user || user.hasVerifiedEmail()) {
      return response.notAcceptable()
    }

    // Send email verification
    user.notifyLater(new SendEmailVerification())

    return response.created({ message: 'We have emailed your email verification link.' })
  }

  /**
   * Verify email address
   */
  public async update ({ request, response }: HttpContextContract) {
    // Validation request
    const { token: tokenString } = await request.validate(UpdateValidator)

    // Get token by token string
    const token = await Token.getToken(tokenString, TokenType.VERIFY_EMAIL)

    // If token not found
    if (!token) {
      return response.unauthorized({ message: 'This email verify token is invalid.' })
    }

    // Set email verified at
    await token.user.merge({ emailVerifiedAt: DateTime.now() }).save()
    // Set token to expired
    await token.setExpired()

    return response.created({ message: 'Your email has been verified.' })
  }
}
