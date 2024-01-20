import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Config from '@ioc:Adonis/Core/Config'
import View from '@ioc:Adonis/Core/View'
import Order from 'App/Models/Order'
import mjml from 'mjml'

export default class NewOrder extends BaseMailer {
  constructor (private order: Order) {
    super()
  }

  public async prepare (message: MessageContract) {
    const view = await View.render('emails::new-order', { order: this.order })

    message
      .subject('New Order')
      .from(Config.get('mail.mailers.smtp.auth.user'))
      .to('e3d.widya@gmail.com')
      .html(mjml(view).html)
  }
}
