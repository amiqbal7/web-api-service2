import { DateTime } from 'luxon'
import { column, BaseModel, scope, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class Notif extends BaseModel {
  public static orderColums = ['created_at']
  public static searchColums = []

  public static filters = scope((
    _query: ModelQueryBuilderContract<typeof Notif>,
    filters?: {
      search?: string;
    }
  ) => {
    if (filters && filters.search) {
      //
    }
  })
  public static dateRange = scope((
    query: ModelQueryBuilderContract<typeof Notif>,
    startDate?: DateTime,
    endDate?: DateTime
  ) => {
    if (startDate) {
      query.where('notifs.created_at', '>=', `${startDate.toISODate()} 00:00:00`)
    }

    if (endDate) {
      query.where('notifs.created_at', '<=', `${endDate.toISODate()} 23:59:59`)
    }
  })

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true })
  public readAt: DateTime
}
