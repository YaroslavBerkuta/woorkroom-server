import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigModule } from '@nestjs/config';
import { dataBaseConfig, mailConfig, rmqpConfig } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [dataBaseConfig, rmqpConfig, mailConfig],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigurationModule {}
