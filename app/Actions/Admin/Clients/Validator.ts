import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Gender } from 'App/Enums'

export class IndexValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    page: schema.number.nullableAndOptional([
      rules.unsigned(),
    ]),
    limit: schema.number.nullableAndOptional([
      rules.unsigned(),
    ]),
    filters: schema.object.nullableAndOptional().members({
      search: schema.string.nullableAndOptional({ trim: true }),
    }),
  })

  public messages: CustomMessages = {}
}

export class StoreValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.maxLength(255),
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
      rules.maxLength(255),
    ]),
    phone: schema.string({ trim: true }, [
      rules.mobile({ strict: true }),
      rules.maxLength(50),
    ]),
    address: schema.string({ trim: true }, [
      rules.maxLength(255),
    ]),
    gender: schema.enum(Object.values(Gender)),
    company: schema.string.nullableAndOptional({ trim: true }, [
      rules.maxLength(255),
    ]),
  })

  public messages: CustomMessages = {}
}
