import { NestFactory } from '@nestjs/core';
import { AuthorizationModule } from './authorization.module';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthorizationModule, {
    logger: new ConsoleLogger({
      prefix: 'Authorization',
    }),
  });

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: config.get<string[]>('rmqp.urls'),
      queue: config.get<string>('rmqp.queue.authorization'),
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.init();
}
void bootstrap();
