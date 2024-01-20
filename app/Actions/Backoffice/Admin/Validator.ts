import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin'

export class IndexValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    page: schema.number.optional([
      rules.unsigned(),
    ]),
    limit: schema.number.optional([
      rules.unsigned(),
    ]),
    startDate: schema.date.optional({
      format: 'sql',
    }),
    endDate: schema.date.optional({
      format: 'sql',
    }, [
      rules.requiredIfExists('startDate'),
      rules.afterOrEqualToField('startDate'),
    ]),
    orderBy: schema.enum.optional(Admin.orderColums),
    orderType: schema.enum.optional(['asc', 'desc'] as const),
    filters: schema.object.optional().members({
      search: schema.string.optional({ trim: true }),
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
      rules.unique({ table: 'admins', column: 'email' }),
      rules.maxLength(255),
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
