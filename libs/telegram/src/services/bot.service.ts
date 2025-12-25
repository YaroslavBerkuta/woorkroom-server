import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { Command, ShareContactCommand, StartCommand } from '../commands';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  constructor(
    @Inject('TG_BOT') private readonly bot: Telegraf<Context>,
    private readonly startCommand: StartCommand,
    private readonly shareContactCommand: ShareContactCommand,
  ) {}

  onModuleInit() {
    void this.registerHandlers();
    void this.startBot();
  }

  onModuleDestroy() {
    try {
      this.bot.stop('module_destroy');
      this.logger.log('Telegram bot stopped');
    } catch (e) {
      this.logger.warn(`Telegram bot stop error: ${(e as Error).message}`);
    }
  }

  private registerHandlers() {
    this.startCommand.handler();
    this.shareContactCommand.handler();
  }

  private async startBot() {
    try {
      await this.bot.launch();
      this.logger.log('Telegram bot launched (polling)');
    } catch (e) {
      this.logger.error(`Failed to launch bot: ${(e as Error).message}`);
      throw e;
    }
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}
