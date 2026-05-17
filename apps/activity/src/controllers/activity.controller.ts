import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { ActivityService } from '../services';
import { EMessageRmqp } from 'shared';

@Controller()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @MessagePattern(EMessageRmqp.AUDIT_EVENT)
  async handleActivityEvent(
    @Payload()
    data: {
      service: string;
      action: string;
      actorEmployeeId: string;
      resourceId: string;
      meta?: Record<string, unknown>;
    },
  ): Promise<void> {
    await this.activityService.recordHistory({
      resourceId: data.resourceId,
      resourceType: data.service,
      actorEmployeeId: data.actorEmployeeId,
      action: data.action,
      meta: data.meta,
    });
  }

  @GrpcMethod('ActivityService', 'GetActivityFeed')
  async getActivityFeed(dto: {
    resourceId: string;
    types?: string[];
    limit: number;
    offset: number;
  }) {
    return this.activityService.getActivityFeed(
      dto.resourceId,
      dto.types ?? [],
      dto.limit,
      dto.offset,
    );
  }

  @GrpcMethod('ActivityService', 'AddComment')
  async addComment(dto: {
    resourceId: string;
    resourceType: string;
    actorEmployeeId: string;
    content: string;
    attachments?: { url: string; thumbnailUrl?: string; name: string; mimetype: string; size: number }[];
  }) {
    return this.activityService.addComment(dto);
  }

  @GrpcMethod('ActivityService', 'EditComment')
  async editComment(dto: {
    id: string;
    content: string;
    attachments?: { url: string; thumbnailUrl?: string; name: string; mimetype: string; size: number }[];
  }) {
    return this.activityService.editComment(dto.id, dto.content, dto.attachments);
  }

  @GrpcMethod('ActivityService', 'DeleteComment')
  async deleteComment(dto: { id: string }) {
    const value = await this.activityService.deleteComment(dto.id);
    return { value };
  }
}
