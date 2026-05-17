import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { randomUUID } from 'crypto';

export type AuditEventDocument = AuditEvent &
  Document & { createdAt: Date; updatedAt: Date };

function docTransform(_: unknown, ret: Record<string, unknown>) {
  ret.id = ret._id;
  delete ret._id;
  return ret;
}

@Schema({
  collection: 'audit_events',
  timestamps: true,
  versionKey: false,
  toJSON: { transform: docTransform },
  toObject: { transform: docTransform },
})
export class AuditEvent {
  @Prop({ type: String, default: () => randomUUID() })
  _id: string;

  @Prop({ required: true, index: true })
  service: string;

  @Prop({ required: true, index: true })
  action: string;

  @Prop({ required: true })
  actorEmployeeId: string;

  @Prop({ required: true, index: true })
  resourceId: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  meta: Record<string, unknown>;
}

export const AuditEventSchema = SchemaFactory.createForClass(AuditEvent);
