import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { SmtpModule } from 'woorkroom/smtp';
import { TelegramModule } from 'woorkroom/telegram';

@Module({
  imports: [ConfigurationModule, SmtpModule, TelegramModule],
})
export class MailsModule {}
