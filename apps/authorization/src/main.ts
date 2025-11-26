import { NestFactory } from '@nestjs/core';
import { AuthorizationModule } from './authorization.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthorizationModule);
  await app.listen();
}
void bootstrap();
