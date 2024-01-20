import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, ModelQueryBuilderContract, beforeFind, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import TokenType from 'App/Enums/TypeToken'
import Admin from './Admin'

export default class AdminToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public adminId: number | null

  @column()
  public name: string

  @column()
  public type: TokenType

  @column()
  public token: string

  @column.dateTime()
  public expiresAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @belongsTo(() => Admin)
  public admin: BelongsTo<typeof Admin>

  @beforeFind()
  public static ignoreExpired (query: ModelQueryBuilderContract<typeof AdminToken>) {
    query.whereNull('expiresAt').orWhere('expiresAt', '>', DateTime.now().toString())
  }

  /**
   * Get token by token string
   */
  public static async getToken (token: string, type: TokenType) {
    return await AdminToken.query()
      .preload('admin')
      .where('token', token)
      .where('type', type)
      .first()
  }

  /**
   * Set token to expired
   */
  public async setExpired () {
    const token = this as AdminToken

    await token.merge({ expiresAt: DateTime.now() }).save()
  }
}
