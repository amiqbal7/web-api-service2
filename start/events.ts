
import Event from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'

Event.on('auth:login', 'Auth.onLogin')
Event.on('auth:logout', 'Auth.onLogout')
Event.on('auth:register', 'Auth.onRegister')

Event.on('mail:sent', Mail.prettyPrint)
