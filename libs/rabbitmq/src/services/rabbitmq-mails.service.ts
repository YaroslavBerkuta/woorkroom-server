import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EMessageRmqp } from 'shared';

@Injectable()
export class RabbitmqMailsService {
  constructor(
    @Inject('MAILS_SERVICE') private readonly mailsService: ClientProxy,
  ) {}

  sendVerificationCode(phone: string, code: string) {
    return this.mailsService.send(EMessageRmqp.SEND_VERIFICATION_CODE, { phone, code });
  }
}
