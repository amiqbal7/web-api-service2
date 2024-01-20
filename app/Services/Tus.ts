import Application from '@ioc:Adonis/Core/Application'
// import Config from '@ioc:Adonis/Core/Config'
import { Server } from '@tus/server'
import { FileStore } from '@tus/file-store'
// import { S3Store } from '@tus/s3-store'
// local
const datastore = new FileStore({
  directory: Application.tmpPath('uploads/tus'),
})

// AWS S3
// const datastore = new S3Store({
//   partSize: 6 * 1024 * 1024, // Each uploaded part will have ~8MB,
//   s3ClientConfig: {
//     bucket: Config.get('drive.disks.s3.bucket'),
//     region: Config.get('drive.disks.s3.region'),
//     credentials: {
//       accessKeyId: Config.get('drive.disks.s3.key'),
//       secretAccessKey: Config.get('drive.disks.s3.secret'),
//     },
//   },
// })

const TusServer = new Server({
  path: '/uploads',
  respectForwardedHeaders: true,
  datastore,
})

export default TusServer
