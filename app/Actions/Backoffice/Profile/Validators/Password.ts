import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    current_password: schema.string({ trim: true }),
    password: schema.string({ trim: true }, [
      rules.confirmed('password_confirmation'),
      rules.minLength(8),
    ]),
  })

  public messages: CustomMessages = {}
}
