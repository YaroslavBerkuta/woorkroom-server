import { NestFactory } from '@nestjs/core';
import { CompanysModule } from './companys.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(CompanysModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_URL],
      queue: process.env.COMPANYS_QUEUE,
    },
  });
  await app.listen();
}
bootstrap();
