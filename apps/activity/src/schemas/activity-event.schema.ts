import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { randomUUID } from 'crypto';

@Schema({ _id: false })
class Attachment {
  @Prop({ required: true }) url: string;
  @Prop() thumbnailUrl?: string;
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) mimetype: string;
  @Prop({ required: true }) size: number;
}
const AttachmentSchema = SchemaFactory.createForClass(Attachment);

export { Attachment };

export type ActivityEventDocument = ActivityEvent &
  Document & { createdAt: Date; updatedAt: Date };

function docTransform(_: unknown, ret: Record<string, unknown>) {
  ret.id = ret._id;
  delete ret._id;
  return ret;
}

@Schema({
  collection: 'activity_events',
  timestamps: true,
  versionKey: false,
  toJSON: { transform: docTransform },
  toObject: { transform: docTransform },
})
export class ActivityEvent {
  @Prop({ type: String, default: () => randomUUID() })
  _id: string;

  @Prop({ required: true, index: true })
  resourceId: string;

  @Prop({ required: true })
  resourceType: string;

  @Prop({ required: true, index: true })
  type: string;

  @Prop({ required: true })
  actorEmployeeId: string;

  @Prop()
  action?: string;

  @Prop()
  content?: string;

  @Prop({ type: [AttachmentSchema], default: [] })
  attachments?: Attachment[];

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  meta?: Record<string, unknown>;

  @Prop({ default: false })
  isEdited: boolean;

  @Prop()
  editedAt?: Date;
}

export const ActivityEventSchema = SchemaFactory.createForClass(ActivityEvent);
