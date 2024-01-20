import type { EventsList } from '@ioc:Adonis/Core/Event'
import Logger from '@ioc:Adonis/Core/Logger'
import SendEmailVerification from 'App/Notifications/SendEmailVerification'

export default class Auth {
  public async onLogin (user: EventsList['auth:login']) {
    Logger.info(user.toJSON(), 'user login')
  }

  public async onLogout (user: EventsList['auth:logout']) {
    Logger.info(user.toJSON(), 'user logout')
  }

  public async onRegister (user: EventsList['auth:register']) {
    Logger.info(user.toJSON(), 'user register')
    // Send verification email
    if ('emailVerifiedAt' in user) {
      user.notifyLater(new SendEmailVerification())
    }
  }
}
