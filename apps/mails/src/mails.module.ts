import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ConfigurationModule } from 'woorkroom/config';
import { TelegramModule } from 'woorkroom/telegram';
import { RedisModule } from 'woorkroom/redis';
import { MainService } from './services';
import { MailsController } from './controllers';
import { MailEvent, MailEventSchema } from './schemas/mail-event.schema';

@Module({
  imports: [
    ConfigurationModule,
    TelegramModule,
    RedisModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongo.mails'),
      }),
    }),
    MongooseModule.forFeature([{ name: MailEvent.name, schema: MailEventSchema }]),
  ],
  controllers: [MailsController],
  providers: [
    {
      provide: MainService.name,
      useClass: MainService,
    },
  ],
})
export class MailsModule {}
