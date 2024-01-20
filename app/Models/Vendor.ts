import { DateTime } from 'luxon'
import { column, BaseModel, scope, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class Vendor extends BaseModel {
  public static orderColums = ['created_at']
  public static searchColums = []

  public static filters = scope((
    _query: ModelQueryBuilderContract<typeof Vendor>,
    filters?: {
      search?: string;
    }
  ) => {
    if (filters && filters.search) {
      //
    }
  })

  public static dateRange = scope((
    query: ModelQueryBuilderContract<typeof Vendor>,
    startDate?: DateTime,
    endDate?: DateTime
  ) => {
    if (startDate) {
      query.where('vendors.created_at', '>=', `${startDate.toISODate()} 00:00:00`)
    }

    if (endDate) {
      query.where('vendors.created_at', '<=', `${endDate.toISODate()} 23:59:59`)
    }
  })

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public address: string

  @column()
  public description: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
