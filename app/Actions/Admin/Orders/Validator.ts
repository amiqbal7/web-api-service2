import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OrderType, OrderStatus } from 'App/Enums'

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
      type: schema.array.nullableAndOptional().members(schema.enum(Object.values(OrderType))),
      status: schema.array.nullableAndOptional().members(schema.enum(Object.values(OrderStatus))),
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
      extnames: ['stl', 'STL', 'zip', 'rar'],
    }),
  })

  public messages: CustomMessages = {}
}
