import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  HasMany,
  hasMany,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import Route from '@ioc:Adonis/Core/Route'
import { appUrl } from 'Config/app'
import AdminToken from './AdminToken'
import {
  AttachmentContract,
  attachment,
} from '@ioc:Adonis/Addons/AttachmentLite'
import { Notifiable } from '@ioc:Verful/Notification/Mixins'
import { compose } from '@ioc:Adonis/Core/Helpers'

export default class Admin extends compose(BaseModel, Notifiable('notifications')) {
  public static orderColums = ['created_at']
  public static searchColums = []

  public static filters = scope((
    _query: ModelQueryBuilderContract<typeof Admin>,
    filters?: {
      search?: string;
    }
  ) => {
    if (filters && filters.search) {
      //
    }
  })

  public static dateRange = scope((
    query: ModelQueryBuilderContract<typeof Admin>,
    startDate?: DateTime,
    endDate?: DateTime
  ) => {
    if (startDate) {
      query.where('admins.created_at', '>=', `${startDate.toISODate()} 00:00:00`)
    }

    if (endDate) {
      query.where('admins.created_at', '<=', `${endDate.toISODate()} 23:59:59`)
    }
  })

  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public isPrimary: boolean

  @attachment({
    disk: 's3',
    folder: 'admins/avatars',
    preComputeUrl: async (disk, file) => Route.makeUrl(`/drive/${disk.name}/*`, [file.name], {
      prefixUrl: appUrl,
    }),
  })
  public avatar: AttachmentContract | null

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public role: string | null

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @hasMany(() => AdminToken)
  public tokens: HasMany<typeof AdminToken>

  @beforeSave()
  public static async hashPassword (admin: Admin) {
    if (admin.$dirty.password) {
      admin.password = await Hash.make(admin.password)
    }
  }
}
