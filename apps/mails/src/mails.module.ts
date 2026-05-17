import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { MongoModule } from 'woorkroom/mongo';
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
    MongoModule.forMails([{ name: MailEvent.name, schema: MailEventSchema }]),
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
