import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor (protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    userId: this.ctx.auth.use('admin').user?.id,
  })

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
      rules.unique({ table: 'admins', column: 'email', whereNot: { id: this.refs.userId } }),
      rules.maxLength(255),
    ]),
    phone: schema.string({ trim: true }, [
      rules.mobile({ strict: true }),
      rules.maxLength(50),
    ]),
    role: schema.string.nullableAndOptional({ trim: true }, [
      rules.maxLength(255),
    ]),
  })

  public messages: CustomMessages = {}
}
