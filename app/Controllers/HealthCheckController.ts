import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

/**
 * Show healthcheck
 */
export default class HealthCheckController {
  public async handle ({ response }: HttpContextContract) {
    const report = await HealthCheck.getReport()

    return report.healthy ? response.ok(report) : response.badRequest(report)
  }
}
