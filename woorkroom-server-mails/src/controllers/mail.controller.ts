import { Controller, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { IMailService, QueueCommnadsEnum, TELEGRAM_SERVICE } from 'src/types';

@Controller()
export class MailController {
  constructor(
    @Inject(TELEGRAM_SERVICE) private readonly telegramService: IMailService,
  ) {}

  @EventPattern(QueueCommnadsEnum.SEND_CONFIRM_CODE)
  async sendVerificationCode(data: { to: string; code: string }) {
    await this.telegramService.sendVerificationCode(data.to, data.code);
  }
}
