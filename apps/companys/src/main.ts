import { NestFactory } from '@nestjs/core';
import { CompanysModule } from './companys.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(CompanysModule, {
    logger: new ConsoleLogger({
      prefix: 'Companys',
    }),
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'companys',
      protoPath: join(process.cwd(), 'proto', 'companys.proto'),
      url: `0.0.0.0:${config.get<number>('grpc.companys.port')}`,
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
}
void bootstrap();
