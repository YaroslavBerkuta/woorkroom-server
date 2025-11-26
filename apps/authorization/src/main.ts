import { NestFactory } from '@nestjs/core';
import { AuthorizationModule } from './authorization.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthorizationModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_URL],
      queue: process.env.AUTHORIZATION_QUEUE,
    },
  });
  await app.listen();
}
bootstrap();
