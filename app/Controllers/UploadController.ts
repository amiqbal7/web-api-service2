// import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TusServer from 'App/Services/Tus'
// import ConfigBodyParser from 'Config/bodyparser'

/**
 * Upload Controller
 */
export default class UploadController {
  public async handle ({ request, response }: HttpContextContract) {
    // bug pada tus proto => https, https
    request.request.headers['x-forwarded-proto'] = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    return TusServer.handle(request.request, response.response)
  }
}
