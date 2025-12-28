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
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
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
