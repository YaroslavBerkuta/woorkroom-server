import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { AuditService } from '../services';
import { EMessageRmqp } from 'shared';

@Controller()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @MessagePattern(EMessageRmqp.AUDIT_EVENT)
  async handleAuditEvent(
    @Payload()
    data: {
      service: string;
      action: string;
      actorEmployeeId: string;
      resourceId: string;
      meta: Record<string, unknown>;
    },
  ): Promise<void> {
    await this.auditService.recordEvent(data);
  }

  @GrpcMethod('AuditService', 'GetAuditEvents')
  async getAuditEvents(dto: {
    resourceId: string;
    limit: number;
    offset: number;
  }) {
    return this.auditService.getAuditEvents(dto.resourceId, dto.limit, dto.offset);
  }
}
