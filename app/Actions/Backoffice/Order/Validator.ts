import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OrderType, OrderStatus } from 'App/Enums'
import Order from 'App/Models/Order'

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
    orderBy: schema.enum.optional(Order.orderColums),
    orderType: schema.enum.optional(['asc', 'desc'] as const),
    filters: schema.object.optional().members({
      search: schema.string.optional({ trim: true }),
      type: schema.array.optional().members(schema.enum(Object.values(OrderType))),
      status: schema.array.optional().members(schema.enum(Object.values(OrderStatus))),
    }),
  })

  public messages: CustomMessages = {}
}

export class ConfirmValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    price: schema.number(),
    jnt_price: schema.number.nullableAndOptional(),
    gosend_price: schema.number.nullableAndOptional(),
  })

  public messages: CustomMessages = {}
}

export class DeliveryValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    complete: schema.boolean.nullableAndOptional(),
    track_number: schema.string.nullableAndOptional({ trim: true }),
    file: schema.file.nullableAndOptional({
      size: '300mb',
      extnames: ['stl', 'STL', 'zip', 'rar', 'png'],
    }),
  })

  public messages: CustomMessages = {}
}
