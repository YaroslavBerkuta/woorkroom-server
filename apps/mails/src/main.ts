import { NestFactory } from '@nestjs/core';
import { MailsModule } from './mails.module';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(MailsModule, {
    logger: new ConsoleLogger({
      prefix: 'Mails',
    }),
  });

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: config.get<string[]>('rmqp.urls'),
      queue: config.get<string>('rmqp.queue.mails'),
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.init();
}
void bootstrap();
