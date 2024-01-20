/**
 * Config source: https://bit.ly/3yXw6Tw
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { limiterConfig } from '@adonisjs/limiter/build/config'

export default limiterConfig({
  /*
  |--------------------------------------------------------------------------
  | Default store
  |--------------------------------------------------------------------------
  |
  | The default store for persisting rate limiter data
  |
  */
  default: 'db',

  /*
  |--------------------------------------------------------------------------
  | Stores
  |--------------------------------------------------------------------------
  |
  | A collection of stores you want to use within your application. You
  | can switch the stores at runtime using the `Limiter.use` method.
  |
  */
  stores: {
    db: {
      client: 'db',
      dbName: Env.get('MYSQL_DB_NAME'),
      tableName: 'rate_limits',
      connectionName: Env.get('DB_CONNECTION'),
      clearExpiredByTimeout: true,
    },
  },
})
