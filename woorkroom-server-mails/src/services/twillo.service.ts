import { Inject, Injectable } from '@nestjs/common';
import { IMailService } from 'src/types';
import { TWILLO_CLIENT } from 'src/types/consts';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService implements IMailService {
  constructor(@Inject(TWILLO_CLIENT) private readonly twilioClient: Twilio) {}

  async sendVerificationCode(to: string, code: string): Promise<void> {
    const body = `Your verification code is ${code}.`;
    const from = process.env.TWILIO_PHONE;

    const message = await this.twilioClient.messages.create({
      body,
      from,
      to,
    });

    console.log(`Message sent: ${message}`);
  }
}
