import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UsersModule, {});
  await app.listen();
}
void bootstrap();
