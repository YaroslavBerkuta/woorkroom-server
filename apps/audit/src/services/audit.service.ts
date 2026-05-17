import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditEvent, AuditEventDocument } from '../schemas/audit-event.schema';

interface RecordEventDto {
  service: string;
  action: string;
  actorEmployeeId: string;
  resourceId: string;
  meta: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditEvent.name)
    private readonly auditEventModel: Model<AuditEventDocument>,
  ) {}

  async recordEvent(dto: RecordEventDto): Promise<void> {
    const doc = new this.auditEventModel({
      service: dto.service,
      action: dto.action,
      actorEmployeeId: dto.actorEmployeeId,
      resourceId: dto.resourceId,
      meta: dto.meta ?? {},
    });
    await doc.save();
  }

  async getAuditEvents(
    resourceId: string,
    limit: number,
    offset: number,
  ): Promise<{ events: Record<string, unknown>[]; total: number }> {
    const effectiveLimit = Math.min(limit || 20, 100);
    const effectiveOffset = offset || 0;

    const [docs, total] = await Promise.all([
      this.auditEventModel
        .find({ resourceId })
        .sort({ createdAt: -1 })
        .skip(effectiveOffset)
        .limit(effectiveLimit)
        .exec(),
      this.auditEventModel.countDocuments({ resourceId }),
    ]);

    const events = docs.map((d) => {
      const obj = d.toObject() as unknown as {
        id: string;
        service: string;
        action: string;
        actorEmployeeId: string;
        resourceId: string;
        createdAt?: Date;
        meta?: Record<string, unknown>;
      };
      return {
        id: obj.id,
        service: obj.service,
        action: obj.action,
        actorEmployeeId: obj.actorEmployeeId,
        resourceId: obj.resourceId,
        meta: JSON.stringify(obj.meta ?? {}),
        createdAt: obj.createdAt
          ? obj.createdAt.toISOString()
          : new Date().toISOString(),
      };
    });

    return { events, total };
  }
}
