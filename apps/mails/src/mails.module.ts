import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { SmtpModule } from 'woorkroom/smtp';
import { TelegramModule } from 'woorkroom/telegram';
import { MainService } from './services';

@Module({
  imports: [ConfigurationModule, SmtpModule, TelegramModule],
  providers: [
    {
      provide: MainService.name,
      useClass: MainService,
    },
  ],
})
export class MailsModule {}
