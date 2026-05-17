import { AuditAction } from '../enums';

export interface IAuditEvent {
  id: string;
  service: string;
  action: AuditAction;
  actorEmployeeId: string;
  resourceId: string;
  meta: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
