import Route from '@ioc:Adonis/Core/Route'

export default function () {
  // Auth
  Route.group(() => {
    // Authentication
    Route.post('/login', 'Authenticate.store')
    Route.post('/logout', 'Authenticate.destroy').middleware('auth:admin')
    Route.get('/session', 'Authenticate.show').middleware('auth:admin')

    // Registration
    Route.post('/register', 'Register.store')

    // Password Reset
    Route.post('/password/email', 'ForgotPassword.store')
    Route.post('/password/reset', 'ForgotPassword.update')
  })
    .prefix('/auth')
    .namespace('App/Actions/Admin/Auth/Controllers')

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
    .namespace('App/Actions/Admin/User/Controllers')
    .middleware('auth:admin')

  // Admins
  Route.group(() => {
    Route.get('/', 'Controller.index')
    Route.post('/', 'Controller.store')
    Route.get('/:admin', 'Controller.show')
  })
    .prefix('/admins')
    .middleware('auth:admin')
    .namespace('App/Actions/Admin/Admins')

  // Vendors
  Route.group(() => {
    Route.get('/', 'Controller.index')
    Route.post('/', 'Controller.store')
    Route.get('/:vendor', 'Controller.show')
  })
    .prefix('/vendors')
    .middleware('auth:admin')
    .namespace('App/Actions/Admin/Vendors')

  // Clients
  Route.group(() => {
    Route.get('/', 'Controller.index')
    Route.post('/', 'Controller.store')
    Route.get('/:client', 'Controller.show')
  })
    .prefix('/clients')
    .middleware('auth:admin')
    .namespace('App/Actions/Admin/Clients')

  // Orders
  Route.group(() => {
    Route.get('/', 'Controller.index')
    Route.get('/summary', 'Controller.summary')
    Route.get('/:order', 'Controller.show')
    Route.post('/:order/confirm', 'Controller.confirm')
    Route.post('/:order/receipt', 'Controller.receipt')
    Route.post('/:order/build', 'Controller.build')
    Route.post('/:order/delivery', 'Controller.delivery')
  })
    .prefix('/orders')
    .middleware('auth:admin')
    .namespace('App/Actions/Admin/Orders')
}
