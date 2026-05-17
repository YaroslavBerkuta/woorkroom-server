import { ActivityType } from '../enums';

export interface IActivityEvent {
  id: string;
  resourceId: string;
  resourceType: string;
  type: ActivityType;
  actorEmployeeId: string;
  content?: string;
  meta?: Record<string, unknown>;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
