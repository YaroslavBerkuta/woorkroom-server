import { Controller, Inject } from '@nestjs/common';
import { MainService } from '../services';
import { EMessageRmqp } from 'shared';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailsController {
  constructor(
    @Inject(MainService.name) private readonly mailsService: MainService,
  ) {}

  @MessagePattern(EMessageRmqp.SEND_VERIFICATION_CODE)
  sendVerificationCode(@Payload() data: { phone: string }) {
    return this.mailsService.sendVerificationCode(data.phone);
  }
}
