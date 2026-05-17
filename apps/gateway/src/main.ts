import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Gateway',
      timestamp: false,
    }),
  });

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:4000',
    credentials: true,
  });

  const config = app.get(ConfigService);

  const port = Number(config.get('app.port'));

  await app.listen(port, '0.0.0.0');
  console.log(`Gateway is running on port ${port}`);
}
void bootstrap();
