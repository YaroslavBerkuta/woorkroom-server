import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule, {
    logger: new ConsoleLogger({
      prefix: 'Users',
    }),
  });

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'users',
      protoPath: join(process.cwd(), 'proto', 'users.proto'),
      url: `0.0.0.0:${config.get<number>('grpc.users.port')}`,
      loader: { longs: Number, defaults: true, arrays: true, objects: true, oneofs: true },
    },
  });

  await app.startAllMicroservices();
  await app.init();
}
void bootstrap();
