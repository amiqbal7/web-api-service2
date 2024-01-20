/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }

  /**
   * Makes the JSON response, based upon the environment in
   * which the app is runing
   */
  public async makeJSONResponse (error: any, ctx: HttpContextContract) {
    ctx.response.status(error.status).send({
      // code: error.code,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
    })
  }

  public async handle (error: any, ctx: HttpContextContract) {
    /**
     * Handle the validation exception
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).json({
        // code: error.code,
        message: 'E_VALIDATION_FAILURE: Validation Failure',
        errors: error.messages.errors.reduce((acc: any, detail: any) => {
          return {...acc, [detail.field]: detail.message}
        }, {}),
        ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
      })
    }

    /**
     * Handle the error exception
     */
    const ERROR_CODES = [
      'E_INVALID_AUTH_SESSION',
      'E_INVALID_API_TOKEN',
      'E_INVALID_BASIC_CREDENTIALS',
      'E_INVALID_AUTH_UID',
      'E_INVALID_AUTH_PASSWORD',
    ]
    if (ERROR_CODES.includes(error.code)) {
      return ctx.response.status(error.status).json({
        // code: error.code,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
      })
    }

    /**
     * Forward rest of the exceptions to the parent class
     */
    return super.handle(error, ctx)
  }
}
