import { NestFactory } from '@nestjs/core';
import { CompanysModule } from './companys.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(CompanysModule, {
    logger: new ConsoleLogger({
      prefix: 'Companys',
    }),
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = app.get(ConfigService);

  app
    .connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: config.get<string[]>('rmqp.urls'),
        queue: config.get<string>('rmqp.queue.companys'),
        queueOptions: { durable: true },
      },
    })
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

  await app.startAllMicroservices();
  await app.init();
}
void bootstrap();
