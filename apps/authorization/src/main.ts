import { NestFactory } from '@nestjs/core';
import { AuthorizationModule } from './authorization.module';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AuthorizationModule, {
    logger: new ConsoleLogger({
      prefix: 'Authorization',
    }),
  });

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(process.cwd(), 'proto', 'auth.proto'),
      url: `0.0.0.0:${config.get<number>('grpc.authorization.port')}`,
      loader: { longs: Number, defaults: true, arrays: true, objects: true, oneofs: true },
    },
  });

  await app.startAllMicroservices();
  await app.init();
}
void bootstrap();
