import { Inject, Injectable, Logger } from '@nestjs/common';
import { Context, Markup, Telegraf } from 'telegraf';
import { Command } from './command';

@Injectable()
export class StartCommand extends Command {
  protected readonly logger = new Logger(StartCommand.name);

  constructor(@Inject('TG_BOT') bot: Telegraf<Context>) {
    super(bot);
  }

  handler(): void {
    this.bot.start(async (ctx) => {
      const tgUserId = ctx.from?.id;
      const username = ctx.from?.username;

      this.logger.log(`TG /start from id=${tgUserId} username=${username}`);

      await ctx.reply(
        'Привіт! Натисни кнопку нижче, щоб поділитись номером телефону 👇',
        Markup.keyboard([
          Markup.button.contactRequest('📱 Надіслати мій номер'),
        ])
          .oneTime()
          .resize(),
      );
    });
  }
}
