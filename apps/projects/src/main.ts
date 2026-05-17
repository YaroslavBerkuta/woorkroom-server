import { NestFactory } from '@nestjs/core';
import { ProjectsModule } from './projects.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(ProjectsModule, {
    logger: new ConsoleLogger({
      prefix: 'Projects',
    }),
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'projects',
      protoPath: join(process.cwd(), 'proto', 'projects.proto'),
      url: `0.0.0.0:${config.get<number>('grpc.projects.port')}`,
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
  const healthPort = config.get<number>('health.projects') || 6004;
  await app.listen(healthPort);
}
void bootstrap();
