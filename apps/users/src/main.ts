import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule, {
    logger: new ConsoleLogger({
      prefix: 'Users',
    }),
  });

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: config.get<string[]>('rmqp.urls'),
      queue: config.get<string>('rmqp.queue.users'),
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
}
void bootstrap();
