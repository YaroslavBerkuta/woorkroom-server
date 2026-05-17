import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { IAuditEventItem, IGrpcAuditService } from '../types';

interface AuditEventsResponse {
  events: IAuditEventItem[];
  total: number;
}

interface AuditGrpcClient {
  getAuditEvents(data: unknown): Observable<AuditEventsResponse>;
}

@Injectable()
export class GrpcAuditService implements IGrpcAuditService, OnModuleInit {
  private client: AuditGrpcClient;

  constructor(
    @Inject('AUDIT_GRPC_CLIENT') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.client = this.grpcClient.getService<AuditGrpcClient>('AuditService');
  }

  async getAuditEvents(dto: {
    resourceId: string;
    limit: number;
    offset: number;
  }): Promise<{ events: IAuditEventItem[]; total: number }> {
    const res = await lastValueFrom(this.client.getAuditEvents(dto));
    return { events: res.events ?? [], total: res.total ?? 0 };
  }
}
