import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { MongoModule } from 'woorkroom/mongo';
import { TelegramModule } from 'woorkroom/telegram';
import { RedisModule } from 'woorkroom/redis';
import { MainService } from './services';
import { MailsController } from './controllers';
import { MailEvent, MailEventSchema } from './schemas/mail-event.schema';
import { MailsHealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigurationModule,
    TelegramModule,
    RedisModule,
    MongoModule.forMails([{ name: MailEvent.name, schema: MailEventSchema }]),
    MailsHealthModule,
  ],
  controllers: [MailsController],
  providers: [MainService],
})
export class MailsModule {}
