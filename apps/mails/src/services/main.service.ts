import { Injectable } from '@nestjs/common';
import { SmtpService } from 'woorkroom/smtp';

@Injectable()
export class MainService {
  constructor(private readonly smtpService: SmtpService) {}

  async sendVerificationCode(email: string) {
    await this.smtpService.sendEmail({
      to: email,
      subject: 'Verification code',
      html: `<p>Your verification code has been requested.</p>`,
    });
  }
}
