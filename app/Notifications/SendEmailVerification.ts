import { NotificationContract } from '@ioc:Verful/Notification'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import User from 'App/Models/User'

export default class SendEmailVerification implements NotificationContract {
  public via () {
    return 'mail' as const
  }

  public toMail (notifiable: User) {
    return new VerifyEmail(notifiable)
  }
}
