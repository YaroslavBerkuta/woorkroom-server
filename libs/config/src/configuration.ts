export const dataBaseConfig = () => ({
  postgres: {
    users: {
      type: 'postgres',
      host: process.env.DATABASE_USER_HOST,
      port: Number(process.env.DATABASE_USER_PORT) || 5432,
      username: process.env.DATABASE_USER_USER,
      password: process.env.DATABASE_USER_PASSWORD,
      database: process.env.DATABASE_USER_DATABASE,
    },
    companys: {
      type: 'postgres',
      port: Number(process.env.DATABASE_COMPANY_PORT) || 5432,
      host: process.env.DATABASE_COMPANY_HOST,
      username: process.env.DATABASE_COMPANY_USER,
      password: process.env.DATABASE_COMPANY_PASSWORD,
      database: process.env.DATABASE_COMPANY_DATABASE,
    },
    projects: {
      type: 'postgres',
      port: Number(process.env.DATABASE_PROJECTS_PORT) || 5432,
      host: process.env.DATABASE_PROJECTS_HOST,
      username: process.env.DATABASE_PROJECTS_USER,
      password: process.env.DATABASE_PROJECTS_PASSWORD,
      database: process.env.DATABASE_PROJECTS_DATABASE,
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USER,
    url: process.env.REDIS_URL,
  },
});

export const rmqpConfig = () => ({
  rmqp: {
    host: process.env.RABBITMQ_HOST,
    port: Number(process.env.RABBITMQ_PORT) || 5672,
    username: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASSWORD,
    urls: [
      `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT || 5672}`,
    ],
    queue: {
      users: process.env.RABBITMQ_QUEUE_USERS,
      companys: process.env.RABBITMQ_QUEUE_COMPANYS,
      mails: process.env.RABBITMQ_QUEUE_MAILS,
      authorization: process.env.RABBITMQ_QUEUE_AUTHORIZATION,
      audit: process.env.RABBITMQ_QUEUE_AUDIT,
      activity: process.env.RABBITMQ_QUEUE_ACTIVITY,
    },
  },
});

export const mailConfig = () => ({
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
    fromEmail: process.env.SMTP_FROM_EMAIL,
    fromName: process.env.SMTP_FROM_NAME,
  },
  telegram: {
    bot_token: process.env.TELEGRAM_BOT_TOKEN,
  },
  sms: {},
});

export const grpcConfig = () => ({
  grpc: {
    users: {
      port: Number(process.env.GRPC_USERS_PORT) || 5001,
      url: process.env.GRPC_USERS_URL || 'localhost:5001',
    },
    authorization: {
      port: Number(process.env.GRPC_AUTH_PORT) || 5002,
      url: process.env.GRPC_AUTH_URL || 'localhost:5002',
    },
    companys: {
      port: Number(process.env.GRPC_COMPANYS_PORT) || 5003,
      url: process.env.GRPC_COMPANYS_URL || 'localhost:5003',
    },
    media: {
      port: Number(process.env.GRPC_MEDIA_PORT) || 5004,
      url: process.env.GRPC_MEDIA_URL || 'localhost:5004',
    },
    projects: {
      port: Number(process.env.GRPC_PROJECTS_PORT) || 5005,
      url: process.env.GRPC_PROJECTS_URL || 'localhost:5005',
    },
    audit: {
      port: Number(process.env.GRPC_AUDIT_PORT) || 5006,
      url: process.env.GRPC_AUDIT_URL || 'localhost:5006',
    },
    activity: {
      port: Number(process.env.GRPC_ACTIVITY_PORT) || 5007,
      url: process.env.GRPC_ACTIVITY_URL || 'localhost:5007',
    },
  },
});

export const minioConfig = () => ({
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: Number(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'woorkroom',
    secretKey: process.env.MINIO_SECRET_KEY || 'woorkroom',
    bucket: process.env.MINIO_BUCKET || 'woorkroom-media',
    publicUrl: process.env.MINIO_PUBLIC_URL || 'http://localhost:9000',
  },
  media: {
    httpPort: Number(process.env.MEDIA_HTTP_PORT) || 3001,
    fileBaseUrl: process.env.MEDIA_FILE_BASE_URL,
    internalUrl: process.env.MEDIA_INTERNAL_URL || 'http://media:3001',
  },
});

export const mongoConfig = () => ({
  mongo: {
    projects:
      process.env.MONGODB_PROJECTS_URI ||
      'mongodb://localhost:27017/woorkroom_projects',
    mails:
      process.env.MONGODB_MAILS_URI ||
      'mongodb://localhost:27017/woorkroom_mails',
    audit:
      process.env.MONGODB_AUDIT_URI ||
      'mongodb://localhost:27017/woorkroom_audit',
    activity:
      process.env.MONGODB_ACTIVITY_URI ||
      'mongodb://localhost:27017/woorkroom_activity',
  },
});

export const healthConfig = () => ({
  health: {
    users: Number(process.env.HEALTH_USERS_PORT) || 6001,
    companys: Number(process.env.HEALTH_COMPANYS_PORT) || 6002,
    authorization: Number(process.env.HEALTH_AUTH_PORT) || 6003,
    projects: Number(process.env.HEALTH_PROJECTS_PORT) || 6004,
    activity: Number(process.env.HEALTH_ACTIVITY_PORT) || 6005,
    audit: Number(process.env.HEALTH_AUDIT_PORT) || 6006,
    mails: Number(process.env.HEALTH_MAILS_PORT) || 6007,
  },
});

export const appConfig = () => ({
  app: {
    port: Number(process.env.PORT) || 3000,
  },
  security: {
    passwordSaltRounds: Number(process.env.SECURITY_PASSWORD_SALT_ROUNDS) || 10,
    passwordPepper: process.env.SECURITY_PASSWORD_PEPPER,
  },
  authorization: {
    sessionDays: Number(process.env.AUTHORIZATION_SESSION_DAYS) || 7,
  },
});
