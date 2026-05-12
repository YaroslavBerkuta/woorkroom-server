import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { SmtpModule } from 'woorkroom/smtp';
import { TelegramModule } from 'woorkroom/telegram';
import { MainService } from './services';
import { MailsController } from './controllers';

@Module({
  imports: [ConfigurationModule, SmtpModule, TelegramModule],
  controllers: [MailsController],
  providers: [
    {
      provide: MainService.name,
      useClass: MainService,
    },
  ],
})
export class MailsModule {}
