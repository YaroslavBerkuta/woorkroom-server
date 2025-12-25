import { Module } from '@nestjs/common';
import { TelegramService } from './services';
import { ConfigService } from '@nestjs/config';
import { Context, Telegraf } from 'telegraf';
import { commands } from './commands';

@Module({
  providers: [
    ...commands,
    TelegramService,
    {
      provide: 'TG_BOT',
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        const token = config.get<string>('telegram.bot_token');
        if (!token) throw new Error('Missing telegram.bot_token');
        return new Telegraf<Context>(token);
      },
    },
  ],
  exports: [TelegramService],
})
export class TelegramModule {}
