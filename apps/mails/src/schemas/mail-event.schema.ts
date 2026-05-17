import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MailEventDocument = MailEvent & Document;

@Schema({
  collection: 'mail_events',
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
})
export class MailEvent {
  @Prop({ required: true, index: true })
  type: string;

  @Prop({ required: true, index: true })
  recipient: string;

  @Prop({ required: true })
  provider: string;

  @Prop({ required: true })
  status: string;

  @Prop({ type: Object })
  payload?: Record<string, unknown>;
}

export const MailEventSchema = SchemaFactory.createForClass(MailEvent);
