import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);

  constructor(@Inject('TG_BOT') private readonly bot: Telegraf) {}

  onModuleInit() {
    this.registerHandlers();
    this.startBot();
  }

  onModuleDestroy() {
    // коректно зупиняємо long polling
    try {
      this.bot.stop('module_destroy');
      this.logger.log('Telegram bot stopped');
    } catch (e) {
      this.logger.warn(`Telegram bot stop error: ${(e as Error).message}`);
    }
  }

  private registerHandlers() {
    this.bot.start(async (ctx) => {
      // /start
      const tgUserId = ctx.from?.id;
      const username = ctx.from?.username;

      this.logger.log(`TG /start from id=${tgUserId} username=${username}`);

      await ctx.reply(
        `Привіт! Я бот Woorkroom 👋\nНатисни /start або напиши будь-що, щоб продовжити.`,
      );
    });

    // (опціонально) щоб бачити що бот живий
    this.bot.on('text', async (ctx) => {
      await ctx.reply('Отримав ✅');
    });

    // лог помилок telegraf
    this.bot.catch((err) => {
      this.logger.error('Telegraf error', err as any);
    });
  }

  private async startBot() {
    try {
      // запускаємо long polling
      await this.bot.launch();
      this.logger.log('Telegram bot launched (polling)');
    } catch (e) {
      this.logger.error(`Failed to launch bot: ${(e as Error).message}`);
      throw e;
    }

    // щоб процес нормально закривався
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}
