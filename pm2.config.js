module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: '@e3d/api-service',
      script: './build/server.js',
      autorestart: true,
      port: 3010,
      env: {
        PORT: 3010,
        HOST: '0.0.0.0',
        NODE_ENV: 'production',
        TZ: 'Asia/Jakarta',
        NODE_TLS_REJECT_UNAUTHORIZED: '0',

        APP_NAME: '@e3d/api-service',
        APP_KEY: '5N0aX0qyZ-KBC_Nd1BgTASHpYRdfga1b',
        APP_URL: 'https://api-e3d.widyaimersif.com',
        CACHE_VIEWS: true,

        DRIVE_DISK: 'local',
        S3_KEY: 'AKIAWYAHTVO2OORGQ3OX',
        S3_SECRET: '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',
        S3_BUCKET: 'e3dbucket-server',
        S3_REGION: 'ap-southeast-1',

        DB_CONNECTION: 'mysql',
        MYSQL_HOST: '127.0.0.1',
        MYSQL_PORT: '3306',
        MYSQL_USER: 'e3d',
        MYSQL_PASSWORD: '',
        MYSQL_DB_NAME: 'e3d',

        SMTP_HOST: 'smtp.gmail.com',
        SMTP_PORT: 587,
        SMTP_USERNAME: 'cs@widyaimersif.com',
        SMTP_PASSWORD: 'qcxauskigujijmsf',
      },
    },
  ],
}
