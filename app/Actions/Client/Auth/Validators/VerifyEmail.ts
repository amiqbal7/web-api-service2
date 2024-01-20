import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    token: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {}
}
