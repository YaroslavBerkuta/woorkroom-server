import { Inject, Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { IMailService, TELEGRAM_BOT } from 'src/types';

@Injectable()
export class TelegramService implements IMailService {
  constructor(@Inject(TELEGRAM_BOT) private readonly bot: TelegramBot) {}

  async sendVerificationCode(to: string, code: string): Promise<void> {
    const message = `${to} ваш код підтвердження: ${code}`;
    await this.bot.sendMessage('-4612885364', message);
  }
}
