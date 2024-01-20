import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'
import { OpaqueTokenContract } from '@ioc:Adonis/Addons/Auth'
import { Limiter } from '@adonisjs/limiter/build/services'
import Admin from 'App/Models/Admin'
import { StoreValidator } from '../Validators/Authenticate'

/**
 * Authentication controller
 */
export default class Authenticate {
  /**
   * Login
   */
  public async store ({ auth, request, response }: HttpContextContract) {
    // Validation request
    const { email, password } = await request.validate(StoreValidator)
    // Rate limit key
    const throttleKey = `login_admin_${email}_${request.ip()}`
    // Create rate limit
    const limiter = Limiter.use({
      requests: 10,
      duration: '15 mins',
      blockDuration: '30 mins',
    })

    // Ensure the login request is not rate limited.
    if (await limiter.isBlocked(throttleKey)) {
      const throttle = await limiter.get(throttleKey)
      return response.tooManyRequests({ message: `Too many login attempts. Please try again in ${Math.ceil((throttle?.retryAfter ?? 0)/60000)} minutes.` })
    }

    // Attempt to authenticate the request's credentials.
    let token: OpaqueTokenContract<Admin>
    try {
      token = await auth.use('admin').attempt(email, password)
    } catch {
      // Increment rate limit
      await limiter.increment(throttleKey)
      return response.badRequest({ message: 'These credentials do not match our records.' })
    }

    // Reset rate limit
    await limiter.delete(throttleKey)

    Event.emit('auth:login', token.user)

    return response.ok(token)
  }

  /**
   * Get session
   */
  public async show ({ auth, response }: HttpContextContract) {
    await auth.use('admin').authenticate()
    // Get user
    const user = auth.use('admin').user

    return response.ok(user?.serialize())
  }

  /**
   * Logout
   */
  public async destroy ({ auth, response }: HttpContextContract) {
    await auth.use('admin').authenticate()
    // Delete token
    await auth.use('admin').revoke()

    const user = auth.use('admin').user
    if (user) {
      Event.emit('auth:logout', user)
    }

    return response.noContent()
  }
}
