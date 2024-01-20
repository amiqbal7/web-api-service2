import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, ModelQueryBuilderContract, beforeFind, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import TokenType from 'App/Enums/TypeToken'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number | null

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

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @beforeFind()
  public static ignoreExpired (query: ModelQueryBuilderContract<typeof Token>) {
    query.whereNull('expiresAt').orWhere('expiresAt', '>', DateTime.now().toString())
  }

  /**
   * Get token by token string
   */
  public static async getToken (token: string, type: TokenType) {
    return await Token.query()
      .preload('user')
      .where('token', token)
      .where('type', type)
      .first()
  }

  /**
   * Set token to expired
   */
  public async setExpired () {
    const token = this as Token

    await token.merge({ expiresAt: DateTime.now() }).save()
  }
}
