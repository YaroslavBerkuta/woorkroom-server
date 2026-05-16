import { NestFactory } from '@nestjs/core';
import { MediaModule } from './media.module';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(MediaModule, {
    logger: new ConsoleLogger({ prefix: 'Media' }),
  });

  app.enableCors({ origin: '*' });

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'media',
      protoPath: join(process.cwd(), 'proto', 'media.proto'),
      url: `0.0.0.0:${config.get<number>('grpc.media.port')}`,
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
  await app.listen(config.get<number>('media.httpPort') || 3001);
  console.log(`Media service is running on port ${config.get<number>('media.httpPort') || 3001}`);
}
void bootstrap();
