/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Client from './routes/client'
import Admin from './routes/admin'
import Backoffice from './routes/backoffice'
import Controller from '../app/Actions/Client/Notif/Controller'

Route.get('/', 'WelcomeController')
Route.get('/healthz', 'HealthCheckController')
Route.get('/drive/local/*', 'DriveController.local')
Route.get('/drive/s3/*', 'DriveController.s3')
Route.post('/uploads', 'UploadController.handle')
Route.route('/uploads/*', ['OPTIONS', 'GET', 'PATCH'], 'UploadController.handle')
Route.group(Client).prefix('/client')
Route.group(Admin).prefix('/admin')
Route.group(Backoffice).prefix('/backoffice')
