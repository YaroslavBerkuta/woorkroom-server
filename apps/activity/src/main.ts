import { NestFactory } from '@nestjs/core';
import { ActivityModule } from './activity.module';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(ActivityModule, {
    logger: new ConsoleLogger({
      prefix: 'Activity',
    }),
  });

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: config.get<string[]>('rmqp.urls'),
      queue: config.get<string>('rmqp.queue.activity'),
      queueOptions: { durable: true },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'activity',
      protoPath: join(process.cwd(), 'proto', 'activity.proto'),
      url: `0.0.0.0:${config.get<number>('grpc.activity.port')}`,
      loader: {
        longs: Number,
        defaults: true,
        arrays: true,
        objects: true,
        oneofs: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.init();
  console.log(
    'Activity service is running on port',
    config.get('grpc.activity.port'),
  );
}
void bootstrap();
