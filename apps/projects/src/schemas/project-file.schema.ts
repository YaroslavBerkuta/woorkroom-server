import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'crypto';

export type ProjectFileDocument = ProjectFile & Document & { createdAt: Date; updatedAt: Date };

function docTransform(_: unknown, ret: Record<string, unknown>) {
  ret.id = ret._id;
  delete ret._id;
  return ret;
}

@Schema({
  collection: 'project_files',
  timestamps: true,
  versionKey: false,
  toJSON: { transform: docTransform },
  toObject: { transform: docTransform },
})
export class ProjectFile {
  @Prop({ type: String, default: () => randomUUID() })
  _id: string;

  @Prop({ required: true, index: true })
  projectId: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  mimeType?: string;

  @Prop()
  size?: number;
}

export const ProjectFileSchema = SchemaFactory.createForClass(ProjectFile);
