import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import { string } from '@ioc:Adonis/Core/Helpers'
import Config from '@ioc:Adonis/Core/Config'
import View from '@ioc:Adonis/Core/View'
import TokenType from 'App/Enums/TypeToken'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import mjml from 'mjml'

export default class VerifyEmail extends BaseMailer {
  constructor (private user: User) {
    super()
  }

  public async prepare (message: MessageContract) {
    // Create token
    const token = await this.user.related('tokens').create({
      type: TokenType.VERIFY_EMAIL,
      name: 'Verification Email Token',
      expiresAt: DateTime.now().plus({ hours: 24 }),
      token: string.generateRandom(64),
    })
    console.log(token)
    // const domain = 'https://google.com'
    // const path = Route.makeUrl('verify.email.verify', [this.token])
    // const url = domain + path
    const view = await View.render('emails::verify-email', { user: this.user, url: 'https://e3d.widyaimersif.com' })

    message
      .subject('Please Verify Your Email')
      .from(Config.get('mail.mailers.smtp.auth.user'))
      .to(this.user.email)
      .html(mjml(view).html)
  }
}
