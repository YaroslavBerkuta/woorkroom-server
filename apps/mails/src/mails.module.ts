import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { TelegramModule } from 'woorkroom/telegram';
import { RedisModule } from 'woorkroom/redis';
import { MainService } from './services';
import { MailsController } from './controllers';

@Module({
  imports: [ConfigurationModule, TelegramModule, RedisModule],
  controllers: [MailsController],
  providers: [
    {
      provide: MainService.name,
      useClass: MainService,
    },
  ],
})
export class MailsModule {}
