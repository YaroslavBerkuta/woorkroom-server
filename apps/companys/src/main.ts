import { NestFactory } from '@nestjs/core';
import { CompanysModule } from './companys.module';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(CompanysModule, {
    logger: new ConsoleLogger({
      prefix: 'Companys',
    }),
  });

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: config.get<string[]>('rmqp.urls'),
      queue: config.get<string>('rmqp.queue.companys'),
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.init();
}
void bootstrap();
