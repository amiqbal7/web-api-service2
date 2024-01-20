import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.exists({ table: 'users', column: 'email' }),
    ]),
  })

  public messages: CustomMessages = {}
}

export class UpdateValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    token: schema.string({ trim: true }),
    password: schema.string({ trim: true }, [
      rules.confirmed('password_confirmation'),
      rules.minLength(8),
    ]),
  })

  public messages: CustomMessages = {}
}
