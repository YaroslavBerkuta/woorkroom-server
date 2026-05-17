export interface IRabbitmqAuditService {
  publish(dto: {
    service: string;
    action: string;
    actorEmployeeId: string;
    resourceId: string;
    meta: Record<string, unknown>;
  }): void;
}
