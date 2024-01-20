import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OrderType, OrderStatus, OrderCourier } from 'App/Enums'

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

export class StoreValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    company: schema.string({ trim: true }),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.maxLength(255),
    ]),
    phone: schema.string({ trim: true }, [
      rules.mobile({ strict: true }),
      rules.maxLength(50),
    ]),
    address: schema.string({ trim: true }),
    type: schema.enum(Object.values(OrderType)),
    // dicom: schema.file({
    //   size: '300mb',
    //   extnames: ['dcm', 'zip', 'rar'],
    // }),
    dicom: schema.string({ trim: true }, [
      rules.url({
        protocols: ['http', 'https'],
        requireTld: process.env.NODE_ENV === 'production',
        requireProtocol: true,
        requireHost: true,
      }),
    ]),
    note: schema.string.nullableAndOptional({ trim: true }),
  })

  public messages: CustomMessages = {}
}

export class ConfirmValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    terms: schema.boolean(),
    courier: schema.enum(Object.values(OrderCourier)),
  })

  public messages: CustomMessages = {}
}

export class ReceiptValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.file({
      size: '5mb',
      extnames: ['png', 'jpg', 'jpeg'],
    }),
  })

  public messages: CustomMessages = {}
}

export class ReviewValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    rate: schema.enum([1, 2, 3, 4, 5] as const),
    message: schema.string.nullableAndOptional({ trim: true }),
  })

  public messages: CustomMessages = {}
}
