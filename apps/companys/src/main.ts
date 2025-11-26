import { NestFactory } from '@nestjs/core';
import { CompanysModule } from './companys.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(CompanysModule);
  await app.listen();
}
void bootstrap();
