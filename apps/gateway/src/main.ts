import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

const NGROK_PATTERN = /^https?:\/\/[a-z0-9-]+\.(ngrok\.io|ngrok-free\.app|ngrok\.app)$/;

function buildOriginList(): string[] {
  const extra = process.env.CORS_ORIGINS ?? '';
  return [
    'http://localhost:4000',
    ...extra.split(',').map((o) => o.trim()).filter(Boolean),
  ];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Gateway',
      timestamp: false,
    }),
  });

  app.use(cookieParser());

  const allowedOrigins = buildOriginList();

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (NGROK_PATTERN.test(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  });

  const config = app.get(ConfigService);

  const port = Number(config.get('app.port'));

  await app.listen(port, '0.0.0.0');
  console.log(`Gateway is running on port ${port}`);
}
void bootstrap();
