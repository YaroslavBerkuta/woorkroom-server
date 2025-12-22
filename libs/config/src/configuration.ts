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
      user: process.env.DATABASE_COMPANY_USER,
      password: process.env.DATABASE_COMPANY_PASSWORD,
      database: process.env.DATABASE_COMPANY_DATABASE,
    },
  },
});

export const rmqpConfig = () => ({
  rmqp: {
    host: process.env.RABBITMQ_HOST,
    port: Number(process.env.RABBITMQ_PORT) || 5672,
    username: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASSWORD,
    urls: [
      `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
    ],
    queue: {
      users: process.env.RABBITMQ_QUEUE_USERS,
      companys: process.env.RABBITMQ_QUEUE_COMPANYS,
    },
  },
});
