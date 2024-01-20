import { DateTime } from 'luxon'
import {
  column,
  beforeSave,
  BaseModel,
  HasMany,
  hasMany,
  scope,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Route from '@ioc:Adonis/Core/Route'
import { appUrl } from 'Config/app'
import {
  attachment,
  AttachmentContract,
} from '@ioc:Adonis/Addons/AttachmentLite'
import { Notifiable } from '@ioc:Verful/Notification/Mixins'
import { types, compose } from '@ioc:Adonis/Core/Helpers'
import Hash from '@ioc:Adonis/Core/Hash'
import Token from './Token'
import Gender from 'App/Enums/Gender'
import Order from './Order'

export default class User extends compose(BaseModel, Notifiable('notifications')) {
  public static orderColums = ['created_at']
  public static searchColums = []

  public static filters = scope((
    _query: ModelQueryBuilderContract<typeof User>,
    filters?: {
      search?: string;
    }
  ) => {
    if (filters && filters.search) {
      //
    }
  })

  public static dateRange = scope((
    query: ModelQueryBuilderContract<typeof User>,
    startDate?: DateTime,
    endDate?: DateTime
  ) => {
    if (startDate) {
      query.where('users.created_at', '>=', `${startDate.toISODate()} 00:00:00`)
    }

    if (endDate) {
      query.where('users.created_at', '<=', `${endDate.toISODate()} 23:59:59`)
    }
  })

  @column({ isPrimary: true })
  public id: number

  @attachment({
    disk: 's3',
    folder: 'users/avatars',
    preComputeUrl: async (disk, file) => Route.makeUrl(`/drive/${disk.name}/*`, [file.name], {
      prefixUrl: appUrl,
    }),
  })
  public avatar: AttachmentContract | null

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public emailVerifiedAt: DateTime | null

  @column()
  public phone: string

  @column()
  public gender: Gender

  @column()
  public address: string

  @column()
  public company: string | null

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  @hasMany(() => Order)
  public orders: HasMany<typeof Order>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  /**
   * Has email verified
   */
  public hasVerifiedEmail () {
    const user = this as User

    return !types.isNull(user?.emailVerifiedAt)
  }
}
