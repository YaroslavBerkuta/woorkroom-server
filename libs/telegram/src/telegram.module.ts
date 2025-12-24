import { Module } from '@nestjs/common';
import { TelegramService } from './bot.service';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

@Module({
  providers: [
    TelegramService,
    {
      provide: 'TG_BOT',
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        const token = config.get<string>('telegram.bot_token');
        if (!token) throw new Error('Missing telegram.botToken');
        const bot = new Telegraf(token);
        bot.catch((err) => console.error('TG bot error:', err));
        return bot;
      },
    },
  ],
  exports: [TelegramService],
})
export class TelegramModule {}
