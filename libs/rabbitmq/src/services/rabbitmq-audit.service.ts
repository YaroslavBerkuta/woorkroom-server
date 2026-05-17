import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EMessageRmqp } from 'shared';

@Injectable()
export class RabbitmqAuditService {
  constructor(
    @Inject('AUDIT_SERVICE') private readonly client: ClientProxy,
  ) {}

  publish(dto: {
    service: string;
    action: string;
    actorEmployeeId: string;
    resourceId: string;
    meta: Record<string, unknown>;
  }): void {
    this.client.emit(EMessageRmqp.AUDIT_EVENT, dto);
  }
}
