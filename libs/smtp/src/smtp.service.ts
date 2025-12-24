import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class SmtpService {
  private transporter: Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get<string>('smtp.host'),
      port: Number(this.configService.get<string>('smtp.port') ?? 1025),
      secure: this.configService.get<string>('smtp.secure') === 'true',
      auth: this.configService.get<string>('smtp.user')
        ? {
            user: this.configService.get<string>('smtp.user'),
            pass: this.configService.get<string>('smtp.password'),
          }
        : undefined,
      from: `${this.configService.get<string>('smtp.fromName')} ${this.configService.get<string>('smtp.fromEmail')}`,
    });
  }

  async sendEmail(input: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    return this.transporter.sendMail({
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
  }
}
