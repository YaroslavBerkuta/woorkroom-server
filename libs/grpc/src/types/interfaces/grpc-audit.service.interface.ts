export interface IAuditEventItem {
  id: string;
  service: string;
  action: string;
  actorEmployeeId: string;
  resourceId: string;
  meta: string;
  createdAt: string;
}

export interface IGrpcAuditService {
  getAuditEvents(dto: {
    resourceId: string;
    limit: number;
    offset: number;
  }): Promise<{ events: IAuditEventItem[]; total: number }>;
}
