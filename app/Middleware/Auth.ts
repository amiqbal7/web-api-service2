import type { GuardsList } from '@ioc:Adonis/Addons/Auth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Auth middleware is meant to restrict un-authenticated access to a given route
 * or a group of routes.
 *
 * You must register this middleware inside `start/kernel.ts` file under the list
 * of named middleware.
 */
export default class AuthMiddleware {
  /**
   * Handle request
   */
  public async handle ({ auth }: HttpContextContract, next: () => Promise<void>, guard: keyof GuardsList) {
    await auth.use(guard ?? auth.name).authenticate()
    await next()
  }
}
