import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Config from '@ioc:Adonis/Core/Config'
import View from '@ioc:Adonis/Core/View'
import User from 'App/Models/User'
import mjml from 'mjml'

export default class DataClient extends BaseMailer {
  constructor (private user: User, private password: string) {
    super()
  }

  public async prepare (message: MessageContract) {
    const view = await View.render('emails::register-client', {
      user: this.user,
      password: this.password,
      url: 'https://e3d.widyaimersif.com',
    })

    message
      .subject('Register Client')
      .from(Config.get('mail.mailers.smtp.auth.user'))
      .to(this.user.email)
      .html(mjml(view).html)
  }
}
