import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'

Mail.monitorQueue((error, result) => {
  if (error) {
    Logger.error(error, 'Unable to send email')
    return
  }

  Logger.info(result, 'Email sent')
})
