import { Inject, Injectable, Logger } from '@nestjs/common';
import { TelegramService } from 'woorkroom/telegram';
import * as redis from 'woorkroom/redis';

@Injectable()
export class MainService {
  private readonly logger = new Logger(MainService.name);

  constructor(
    private readonly telegramService: TelegramService,
    @Inject(redis.RedisService.name)
    private readonly redisService: redis.IRedisService,
  ) {}

  async sendVerificationCode(phone: string, code: string): Promise<void> {
    const normalizedPhone = phone.replace(/\D/g, '');
    const chatId = await this.redisService.get<number>(`tg:phone:${normalizedPhone}`);

    if (!chatId) {
      this.logger.warn(`No Telegram chatId found for phone ${normalizedPhone}`);
      return;
    }

    await this.telegramService.sendMessage(
      chatId,
      `Ваш код підтвердження: *${code}*`,
    );

    this.logger.log(`Verification code sent to chatId ${chatId}`);
  }
}
