import { Inject, Injectable, Logger } from '@nestjs/common';
import { Command } from './command';
import { Context, Markup, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

@Injectable()
export class ShareContactCommand extends Command {
  protected readonly logger = new Logger(ShareContactCommand.name);

  constructor(@Inject('TG_BOT') bot: Telegraf<Context>) {
    super(bot);
  }

  handler() {
    this.bot.on(message('contact'), async (ctx) => {
      await ctx.reply(
        'Дякую! Кредит на тебе оформлено ✅',
        Markup.removeKeyboard(),
      );
    });
  }
}
