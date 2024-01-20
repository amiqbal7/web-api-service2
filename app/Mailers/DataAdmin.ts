import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Config from '@ioc:Adonis/Core/Config'
import View from '@ioc:Adonis/Core/View'
import Admin from 'App/Models/Admin'
import mjml from 'mjml'

export default class DataAdmin extends BaseMailer {
  constructor (private admin: Admin, private password: string) {
    super()
  }

  public async prepare (message: MessageContract) {
    const view = await View.render('emails::register-admin', {
      admin: this.admin,
      password: this.password,
      url: 'https://admin-e3d.widyaimersif.com',
    })

    message
      .subject('Register Admin')
      .from(Config.get('mail.mailers.smtp.auth.user'))
      .to(this.admin.email)
      .html(mjml(view).html)
  }
}
