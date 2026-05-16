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

registerEnumType(ProjectPriority, { name: 'ProjectPriority' });
registerEnumType(ProjectMemberRole, { name: 'ProjectMemberRole' });
