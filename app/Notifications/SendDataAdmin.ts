import { NotificationContract } from '@ioc:Verful/Notification'
import DataAdmin from 'App/Mailers/DataAdmin'
import Admin from 'App/Models/Admin'

export default class SendDataAdmin implements NotificationContract {
  constructor (private password: string) {}

  public via () {
    return 'mail' as const
  }

  public toMail (notifiable: Admin) {
    return new DataAdmin(notifiable, this.password)
  }
}
