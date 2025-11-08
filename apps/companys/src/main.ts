import { NestFactory } from '@nestjs/core';
import { CompanysModule } from './companys.module';

async function bootstrap() {
  const app = await NestFactory.create(CompanysModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
