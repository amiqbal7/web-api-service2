import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Gender from 'App/Enums/Gender'

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
      rules.unique({ table: 'users', column: 'email' }),
      rules.maxLength(255),
    ]),
    password: schema.string({ trim: true }, [
      rules.confirmed('password_confirmation'),
      rules.minLength(8),
    ]),
    address: schema.string({ trim: true }, [
      rules.maxLength(255),
    ]),
    phone: schema.string({ trim: true }, [
      rules.mobile({ strict: true }),
      rules.maxLength(50),
    ]),
    gender: schema.enum(Object.values(Gender)),
    company: schema.string.nullableAndOptional({ trim: true }, [
      rules.maxLength(255),
    ]),
  })

  public messages: CustomMessages = {}
}
