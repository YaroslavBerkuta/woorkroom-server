import { Controller } from '@nestjs/common';
import { MainService } from '../services';
import { EMessageRmqp } from 'shared';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailsController {
  constructor(private readonly mailsService: MainService) {}

  @MessagePattern(EMessageRmqp.SEND_VERIFICATION_CODE)
  sendVerificationCode(@Payload() data: { phone: string }) {
    return this.mailsService.sendVerificationCode(data.phone);
  }
}
