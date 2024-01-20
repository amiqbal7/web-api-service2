import { NotificationContract } from '@ioc:Verful/Notification'
import ForgotPassword from 'App/Mailers/ForgotPassword'
import User from 'App/Models/User'

export default class SendPasswordReset implements NotificationContract {
  public via () {
    return 'mail' as const
  }

  public toMail (notifiable: User) {
    return new ForgotPassword(notifiable)
  }
}
