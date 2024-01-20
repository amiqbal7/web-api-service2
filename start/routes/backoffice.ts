import Route from '@ioc:Adonis/Core/Route'

export default function () {
  // Auth
  Route.group(() => {
    // Authentication
    Route.post('/login', 'Authenticate.store')
    Route.post('/logout', 'Authenticate.destroy').middleware('auth:admin')

    // Registration
    // Route.post('/register', 'Register.store')

    // Password Reset
    // Route.post('/password/email', 'ForgotPassword.store')
    // Route.post('/password/reset', 'ForgotPassword.update')
  })
    .prefix('/auth')
    .namespace('App/Actions/Backoffice/Auth/Controllers')

  // Profile
  Route.group(() => {
    Route.group(() => {
      Route.get('', 'Info.show')
      Route.post('', 'Info.update')
    })
      .prefix('/info')

    Route.group(() => {
      Route.post('', 'Password.update')
    })
      .prefix('/password')
  })
    .prefix('/profile')
    .namespace('App/Actions/Backoffice/Profile/Controllers')
    .middleware('auth:admin')

  // Admins
  Route.group(() => {
    Route.get('/', 'Controller.index')
    Route.post('/', 'Controller.store')
    Route.get('/:admin', 'Controller.show')
  })
    .prefix('/admins')
    .middleware('auth:admin')
    .namespace('App/Actions/Backoffice/Admin')

  // Vendors
  Route.group(() => {
    Route.get('/', 'Controller.index')
    Route.post('/', 'Controller.store')
    Route.get('/:vendor', 'Controller.show')
  })
    .prefix('/vendors')
    .middleware('auth:admin')
    .namespace('App/Actions/Backoffice/Vendor')

  // notification
  Route.group(() => {
    // Index and store notifications
    Route.get('/', 'Controller.index')
    Route.post('/', 'Controller.store')
    // Show a specific notification
    Route.get('/:notif', 'Controller.show')
  })
    .prefix('/notifs')
    .namespace('App/Actions/Backoffice/Notif')

  // Users
  Route.group(() => {
    Route.get('/', 'Controller.index')
    Route.post('/', 'Controller.store')
    Route.get('/:user', 'Controller.show')
  })
    .prefix('/users')
    .middleware('auth:admin')
    .namespace('App/Actions/Backoffice/User')

  // Orders
  Route.group(() => {
    Route.get('/', 'Controller.index')
    Route.get('/summary', 'Controller.summary')
    Route.get('/:order', 'Controller.show')
    Route.post('/:order/confirm', 'Controller.confirm')
    Route.post('/:order/receipt', 'Controller.receipt')
    Route.post('/:order/build', 'Controller.build')
    Route.post('/:order/cancel', 'Controller.cancel')
    Route.post('/:order/delivery', 'Controller.delivery')
    Route.post('/:order/delivered', 'Controller.delivered')
  })
    .prefix('/orders')
    .middleware('auth:admin')
    .namespace('App/Actions/Backoffice/Order')
}
