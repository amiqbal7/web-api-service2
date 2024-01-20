import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LogRequest {
  public async handle ({ request, logger }: HttpContextContract, next: () => Promise<void>) {
    // log incoming
    logger.info(`${request.method()} ${request.url(true)} ${request.ip()}`, {
      headers: request.headers(),
      postBody: request.body(),
    })

    await next()
  }
}
