import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TelegramService } from 'woorkroom/telegram';
import * as redis from 'woorkroom/redis';
import { MailEvent, MailEventDocument } from '../schemas/mail-event.schema';

@Injectable()
export class MainService {
  private readonly logger = new Logger(MainService.name);

  constructor(
    private readonly telegramService: TelegramService,
    @Inject(redis.RedisService.name)
    private readonly redisService: redis.IRedisService,
    @InjectModel(MailEvent.name)
    private readonly mailEventModel: Model<MailEventDocument>,
  ) {}

  async sendVerificationCode(phone: string, code: string): Promise<void> {
    const normalizedPhone = phone.replace(/\D/g, '');
    const chatId = await this.redisService.get<number>(
      `tg:phone:${normalizedPhone}`,
    );

    if (!chatId) {
      this.logger.warn(`No Telegram chatId found for phone ${normalizedPhone}`);
      await this.logEvent(
        'verification_code',
        phone,
        'telegram',
        'no_recipient',
        { normalizedPhone },
      );
      return;
    }

    await this.telegramService.sendMessage(
      chatId,
      `Ваш код підтвердження: *${code}*`,
    );
    this.logger.log(`Verification code sent to chatId ${chatId}`);

    await this.logEvent('verification_code', phone, 'telegram', 'sent', {
      normalizedPhone,
      chatId,
    });
  }

  private async logEvent(
    type: string,
    recipient: string,
    provider: string,
    status: string,
    payload?: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.mailEventModel.create({
        type,
        recipient,
        provider,
        status,
        payload,
      });
    } catch (err) {
      this.logger.error('Failed to log mail event', err);
    }
  }
}
