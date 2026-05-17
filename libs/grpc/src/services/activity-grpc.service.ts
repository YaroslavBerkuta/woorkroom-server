import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { IActivityEventItem, IGrpcActivityService } from '../types';

interface ActivityFeedResponse {
  events: IActivityEventItem[];
  total: number;
}

interface BoolResponse {
  value: boolean;
}

interface ActivityGrpcClient {
  getActivityFeed(data: unknown): Observable<ActivityFeedResponse>;
  addComment(data: unknown): Observable<IActivityEventItem>;
  editComment(data: unknown): Observable<IActivityEventItem>;
  deleteComment(data: unknown): Observable<BoolResponse>;
}

@Injectable()
export class GrpcActivityService implements IGrpcActivityService, OnModuleInit {
  private client: ActivityGrpcClient;

  constructor(
    @Inject('ACTIVITY_GRPC_CLIENT') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.client = this.grpcClient.getService<ActivityGrpcClient>('ActivityService');
  }

  async getActivityFeed(dto: {
    resourceId: string;
    types?: string[];
    limit: number;
    offset: number;
  }): Promise<{ events: IActivityEventItem[]; total: number }> {
    const res = await lastValueFrom(this.client.getActivityFeed(dto));
    return { events: res.events ?? [], total: res.total ?? 0 };
  }

  async addComment(dto: {
    resourceId: string;
    resourceType: string;
    actorEmployeeId: string;
    content: string;
  }): Promise<IActivityEventItem> {
    return lastValueFrom(this.client.addComment(dto));
  }

  async editComment(dto: {
    id: string;
    content: string;
  }): Promise<IActivityEventItem> {
    return lastValueFrom(this.client.editComment(dto));
  }

  async deleteComment(id: string): Promise<boolean> {
    const res = await lastValueFrom(this.client.deleteComment({ id }));
    return res.value;
  }
}
