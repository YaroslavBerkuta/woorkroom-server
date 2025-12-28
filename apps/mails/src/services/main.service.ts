import { Injectable } from '@nestjs/common';
import { SmtpService } from 'libs/smtp/src/smtp.service';

@Injectable()
export class MainService {
  constructor() {}
  sendVerificationCode(phone: string) {}
}
