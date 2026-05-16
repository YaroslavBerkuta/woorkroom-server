import { Inject, Injectable, Logger } from '@nestjs/common';
import { Command } from './command';
import { Context, Markup, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import * as redis from 'woorkroom/redis';

const TG_PHONE_TTL = 60 * 60 * 24 * 5; // 5 days

@Injectable()
export class ShareContactCommand extends Command {
  protected readonly logger = new Logger(ShareContactCommand.name);

  constructor(
    @Inject('TG_BOT') bot: Telegraf<Context>,
    @Inject(redis.RedisService.name)
    private readonly redisService: redis.IRedisService,
  ) {
    super(bot);
  }

  handler() {
    this.bot.on(message('contact'), async (ctx) => {
      const phone = ctx.message.contact.phone_number?.replace(/\D/g, '');
      const chatId = ctx.chat.id;

      if (phone) {
        await this.redisService.ttl(`tg:phone:${phone}`, chatId, TG_PHONE_TTL);
        this.logger.log(`Saved chatId for phone ${phone}`);
      }

      await ctx.reply('Готово! Тепер ти можеш завершити реєстрацію ✅', Markup.removeKeyboard());
    });
  }
}
