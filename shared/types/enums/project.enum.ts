import { registerEnumType } from '@nestjs/graphql';

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum ProjectMemberRole {
  REPORTER = 'REPORTER',
  ASSIGNEE = 'ASSIGNEE',
}

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

registerEnumType(ProjectPriority, { name: 'ProjectPriority' });
registerEnumType(ProjectMemberRole, { name: 'ProjectMemberRole' });
registerEnumType(ProjectStatus, { name: 'ProjectStatus' });
