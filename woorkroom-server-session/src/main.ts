import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => {
          const constraints = error.constraints;
          const field = error.property;
          return {
            field,
            errors: Object.values(constraints),
          };
        });

        return {
          message: 'Validation failed',
          details: formattedErrors,
        };
      },
    }),
  );
  await app.listen(3002);
}
bootstrap();
