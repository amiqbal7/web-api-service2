import { NotificationContract } from '@ioc:Verful/Notification'
import DataClient from 'App/Mailers/DataClient'
import User from 'App/Models/User'

export default class SendDataClient implements NotificationContract {
  constructor (private password: string) {}

  public via () {
    return 'mail' as const
  }

  public toMail (notifiable: User) {
    return new DataClient(notifiable, this.password)
  }
}
