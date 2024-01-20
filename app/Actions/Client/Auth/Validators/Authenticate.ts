import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
    ]),
    password: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {
    required: 'The {{ field }} field is required.',
    email: 'The {{ field }} field must be a valid email address.',
  }
}
