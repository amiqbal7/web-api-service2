import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import {
  BaseModel,
  BelongsTo,
  ModelQueryBuilderContract,
  afterCreate,
  beforeCreate,
  belongsTo,
  column,
  computed,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import Route from '@ioc:Adonis/Core/Route'
import {
  attachment,
  AttachmentContract,
} from '@ioc:Adonis/Addons/AttachmentLite'
import { appUrl } from 'Config/app'
import { OrderType, OrderStatus, OrderCourier } from 'App/Enums'
import User from './User'
import NewOrder from 'App/Mailers/NewOrder'

export default class Order extends BaseModel {
  public static orderColums = ['created_at']
  public static searchColums = []

  public static filters = scope((
    query: ModelQueryBuilderContract<typeof Order>,
    filters?: {
      search?: string;
      type?: OrderType[]
      status?: OrderStatus[]
    }
  ) => {
    if (filters && filters.search) {
      //
    }

    if (filters && filters.type && filters.type.length > 0) {
      query.whereIn('type', filters.type)
    }

    if (filters && filters.status && filters.status.length > 0) {
      query.whereIn('status', filters.status)
    }
  })

  public static dateRange = scope((
    query: ModelQueryBuilderContract<typeof Order>,
    startDate?: DateTime,
    endDate?: DateTime
  ) => {
    if (startDate) {
      query.where('orders.created_at', '>=', `${startDate.toISODate()} 00:00:00`)
    }

    if (endDate) {
      query.where('orders.created_at', '<=', `${endDate.toISODate()} 23:59:59`)
    }
  })

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @computed()
  public get number () {
    return `E3D-${String(this.id).padStart(6, '0')}`
  }

  @computed()
  public get invoice () {
    return [OrderStatus.CANCEL, OrderStatus.COMPLETE, OrderStatus.REVIEW].includes(this.status) ?
      Route.makeUrl('/client/orders/:order/invoice', { order: this.id }, { prefixUrl: appUrl }) :
      null
  }

  @column({ serializeAs: null })
  public userId: number

  @column()
  public company: string

  @column()
  public email: string

  @column()
  public address: string

  @column()
  public phone: string

  // @attachment({
  //   disk: 's3',
  //   folder: 'orders/dicoms',
  //   preComputeUrl: async (disk, file) => Route.makeUrl(`/drive/${disk.name}/*`, [file.name], {
  //     prefixUrl: appUrl,
  //   }),
  // })
  @column()
  public dicom: string

  @attachment({
    disk: 's3',
    folder: 'orders/stl',
    preComputeUrl: async (disk, file) => Route.makeUrl(`/drive/${disk.name}/*`, [file.name], {
      prefixUrl: appUrl,
    }),
  })
  public stl: AttachmentContract | null

  @column()
  public type: OrderType

  @column()
  public note: string | null

  @column()
  public status: OrderStatus

  @column({
    serialize: (value: any) => Number(value),
  })
  public price: number | null

  @attachment({
    disk: 's3',
    folder: 'orders/receipts',
    preComputeUrl: async (disk, file) => Route.makeUrl(`/drive/${disk.name}/*`, [file.name], {
      prefixUrl: appUrl,
    }),
  })
  public receipt: AttachmentContract | null

  @column({
    serialize: (value: any) => Number(value),
  })
  public courierJntPrice: number | null

  @column({
    serialize: (value: any) => Number(value),
  })
  public courierGosendPrice: number | null

  @column()
  public courierType: OrderCourier

  @column()
  public courierTrackNumber: string | null

  @column()
  public reviewRate: number | null

  @column()
  public reviewMessage: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @beforeCreate()
  public static beforeCreate (order: Order) {
    order.uuid = uuid()
  }

  @afterCreate()
  public static async afterCreate (order: Order) {
    // Send email notification to admin
    await new NewOrder(order).sendLater()
  }
}
