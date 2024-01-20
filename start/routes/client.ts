import Route from '@ioc:Adonis/Core/Route'

export default function () {
  // Auth
  Route.group(() => {
    // Authentication
    Route.post('/login', 'Authenticate.store')
    Route.post('/logout', 'Authenticate.destroy').middleware('auth:client')
    Route.get('/session', 'Authenticate.show').middleware('auth:client')

    // Registration
    Route.post('/register', 'Register.store')

    // Email Verification...
    Route.post('/email/send', 'VerifyEmail.store').middleware('auth:client')
    Route.post('/email/verify', 'VerifyEmail.update')

    // Password Reset...
    Route.post('/password/email', 'ForgotPassword.store')
    Route.post('/password/reset', 'ForgotPassword.update')
  })
    .prefix('/auth')
    .namespace('App/Actions/Client/Auth/Controllers')

  // User
  Route.group(() => {
    // Profile
    Route.group(() => {
      Route.get('/', 'Profile.show')
      Route.post('/', 'Profile.store')
    }).prefix('/profile')

    // Password
    Route.group(() => {
      Route.post('/', 'Password.store')
    }).prefix('/password')
  })
    .prefix('/user')
    .namespace('App/Actions/Client/User/Controllers')
    .middleware('auth:client')

  // Orders
  Route.group(() => {
    Route.get('/', 'Controller.index')
    Route.post('/', 'Controller.store')
    Route.get('/progress', 'Controller.progress')
    Route.get('/:order', 'Controller.show')
    Route.get('/:order/invoice', 'Controller.invoice')
    Route.post('/:order/confirm', 'Controller.confirm')
    Route.post('/:order/cancel', 'Controller.cancel')
    Route.post('/:order/receipt', 'Controller.receipt')
    Route.post('/:order/delivery', 'Controller.delivery')
    Route.post('/:order/review', 'Controller.review')
  })
    .prefix('/orders')
    .middleware('auth:client')
    .namespace('App/Actions/Client/Orders')
}

// notification
Route.group(() => {
  Route.get('/', 'Controller.index')
  Route.post('/', 'Controller.store')
  Route.get('/:notif', 'Controller.show')
})
  .prefix('/notifs')
  .middleware('auth:client')
  .namespace('App/Actions/client/Notif')

