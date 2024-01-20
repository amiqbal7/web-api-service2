import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import { string } from '@ioc:Adonis/Core/Helpers'
import Config from '@ioc:Adonis/Core/Config'
import View from '@ioc:Adonis/Core/View'
import TokenType from 'App/Enums/TypeToken'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import mjml from 'mjml'

export default class ForgotPassword extends BaseMailer {
  constructor (private user: User) {
    super()
  }

  public async prepare (message: MessageContract) {
    // Create token
    const token = await this.user.related('tokens').create({
      type: TokenType.PASSWORD_RESET,
      name: 'Forgot Password Token',
      expiresAt: DateTime.now().plus({ hours: 1 }),
      token: string.generateRandom(64),
    })
    console.log(token)
    // const domain = 'https://google.com'
    // const path = Route.makeUrl('verify.email.verify', [this.token])
    // const url = domain + path
    const view = await View.render('emails::forgot-password', { user: this.user, url: 'https://e3d.widyaimersif.com' })

    message
      .subject('Forgot your password')
      .from(Config.get('mail.mailers.smtp.auth.user'))
      .to(this.user.email)
      .html(mjml(view).html)
  }
}
