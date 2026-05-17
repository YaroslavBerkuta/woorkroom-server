import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { ActivityEvent, ActivityEventDocument } from '../schemas/activity-event.schema';

interface RecordHistoryDto {
  resourceId: string;
  resourceType: string;
  actorEmployeeId: string;
  action: string;
  meta?: Record<string, unknown>;
}

interface AttachmentDto {
  url: string;
  thumbnailUrl?: string;
  name: string;
  mimetype: string;
  size: number;
}

interface AddCommentDto {
  resourceId: string;
  resourceType: string;
  actorEmployeeId: string;
  content: string;
  attachments?: AttachmentDto[];
}

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(ActivityEvent.name)
    private readonly activityEventModel: Model<ActivityEventDocument>,
  ) {}

  async recordHistory(dto: RecordHistoryDto): Promise<void> {
    try {
      const doc = new this.activityEventModel({
        resourceId: dto.resourceId,
        resourceType: dto.resourceType,
        type: 'history',
        actorEmployeeId: dto.actorEmployeeId,
        action: dto.action,
        meta: dto.meta ?? {},
        isEdited: false,
      });
      await doc.save();
    } catch {
      // fire-and-forget: silently continue on error
    }
  }

  async addComment(dto: AddCommentDto): Promise<Record<string, unknown>> {
    const doc = new this.activityEventModel({
      resourceId: dto.resourceId,
      resourceType: dto.resourceType,
      type: 'comment',
      actorEmployeeId: dto.actorEmployeeId,
      content: dto.content,
      attachments: dto.attachments ?? [],
      isEdited: false,
    });
    const saved = await doc.save();
    return this.serialize(saved.toObject() as ActivityEventDocument & { id: string });
  }

  async editComment(
    id: string,
    content: string,
    attachments?: AttachmentDto[],
  ): Promise<Record<string, unknown>> {
    const doc = await this.activityEventModel.findById(id).exec();
    if (!doc) throw new RpcException('Comment not found');

    doc.content = content;
    if (attachments !== undefined) doc.attachments = attachments;
    doc.isEdited = true;
    doc.editedAt = new Date();
    const saved = await doc.save();
    return this.serialize(saved.toObject() as ActivityEventDocument & { id: string });
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await this.activityEventModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async getActivityFeed(
    resourceId: string,
    types: string[],
    limit: number,
    offset: number,
  ): Promise<{ events: Record<string, unknown>[]; total: number }> {
    const effectiveLimit = Math.min(limit || 20, 100);
    const effectiveOffset = offset || 0;

    const filter: Record<string, unknown> = { resourceId };
    if (types && types.length > 0) {
      filter.type = { $in: types };
    }

    const [docs, total] = await Promise.all([
      this.activityEventModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(effectiveOffset)
        .limit(effectiveLimit)
        .exec(),
      this.activityEventModel.countDocuments(filter),
    ]);

    const events = docs.map((d) =>
      this.serialize(d.toObject() as ActivityEventDocument & { id: string }),
    );

    return { events, total };
  }

  private serialize(
    obj: ActivityEventDocument & { id: string },
  ): Record<string, unknown> {
    return {
      id: obj.id,
      resourceId: obj.resourceId,
      resourceType: obj.resourceType,
      type: obj.type,
      actorEmployeeId: obj.actorEmployeeId,
      action: obj.action ?? '',
      content: obj.content ?? '',
      attachments: (obj.attachments ?? []).map((a) => ({
        url: a.url,
        thumbnailUrl: a.thumbnailUrl ?? '',
        name: a.name,
        mimetype: a.mimetype,
        size: a.size,
      })),
      meta: JSON.stringify(obj.meta ?? {}),
      isEdited: obj.isEdited ?? false,
      editedAt: obj.editedAt ? obj.editedAt.toISOString() : '',
      createdAt: obj.createdAt
        ? (obj.createdAt as Date).toISOString()
        : new Date().toISOString(),
    };
  }
}
