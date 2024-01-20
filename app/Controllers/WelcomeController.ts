import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Show welcome
 */
export default class WelcomeController {
  public async handle ({ response }: HttpContextContract) {
    return response.ok({
      name: Application.appName,
      version: Application.version!.toString(),
      environment: Application.nodeEnvironment,
    })
  }
}
