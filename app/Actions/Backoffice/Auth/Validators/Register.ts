import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    avatar: schema.file.nullableAndOptional({
      size: '5mb',
      extnames: ['png', 'jpg', 'jpeg'],
    }),
    name: schema.string({ trim: true }, [
      rules.maxLength(255),
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'admins', column: 'email' }),
      rules.maxLength(255),
    ]),
    password: schema.string({ trim: true }, [
      rules.confirmed('password_confirmation'),
      rules.minLength(8),
    ]),
    phone: schema.string({ trim: true }, [
      rules.mobile({ strict: true }),
      rules.maxLength(50),
    ]),
    role: schema.string({ trim: true }, [
      rules.maxLength(255),
    ]),
  })

  public messages: CustomMessages = {}
}
