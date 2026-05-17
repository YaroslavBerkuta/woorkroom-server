import { NestFactory } from '@nestjs/core';
import { AuditModule } from './audit.module';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AuditModule, {
    logger: new ConsoleLogger({
      prefix: 'Audit',
    }),
  });

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: config.get<string[]>('rmqp.urls'),
      queue: config.get<string>('rmqp.queue.audit'),
      queueOptions: { durable: true },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'audit',
      protoPath: join(process.cwd(), 'proto', 'audit.proto'),
      url: `0.0.0.0:${config.get<number>('grpc.audit.port')}`,
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
  const healthPort = config.get<number>('health.audit') || 6006;
  await app.listen(healthPort);
}
void bootstrap();
