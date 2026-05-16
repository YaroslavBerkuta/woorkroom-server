import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  dataBaseConfig,
  grpcConfig,
  mailConfig,
  minioConfig,
  rmqpConfig,
} from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [dataBaseConfig, rmqpConfig, mailConfig, appConfig, grpcConfig, minioConfig],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigurationModule {}
