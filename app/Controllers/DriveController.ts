import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import { extname } from 'path'
import axios from 'axios'

/**
 * Show welcome
 */
export default class DriveController {
  public async local ({ request, response }: HttpContextContract) {
    const location = request.param('*').join('/')

    const { size } = await Drive.use('local').getStats(location)

    response.type(extname(location))
    response.header('content-length', size)

    return response.stream(await Drive.use('local').getStream(location))
  }

  public async s3 ({ request, response }: HttpContextContract) {
    const location = request.param('*').join('/')

    const res = await axios.get(await Drive.use('s3').getSignedUrl(location), {
      responseType: 'stream',
    })

    response.header('content-length', res.headers['content-length'])
    response.header('content-type', res.headers['content-type'])

    return response.stream(res.data)
  }
}
