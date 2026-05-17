import { ProjectMemberRole, ProjectPriority, ProjectStatus } from 'shared/types';

export class CreateProjectDto {
  companyId: string;
  creatorEmployeeId: string;
  name: string;
  starts?: string;
  deadline?: string;
  priority?: ProjectPriority;
  description?: string;
  image?: string;
  reporterId?: string;
  assigneeIds?: string[];
}

export class UpdateProjectStatusDto {
  id: string;
  status: ProjectStatus;
  actorEmployeeId?: string;
}

export class UpdateProjectDto {
  id: string;
  name?: string;
  starts?: string;
  deadline?: string;
  priority?: ProjectPriority;
  description?: string;
  image?: string;
  actorEmployeeId?: string;
}

export class AddProjectMemberDto {
  projectId: string;
  employeeId: string;
  role: ProjectMemberRole;
  actorEmployeeId?: string;
}

export class AddProjectFileDto {
  projectId: string;
  url: string;
  name: string;
  mimeType?: string;
  size?: number;
  actorEmployeeId?: string;
}

export class AddProjectLinkDto {
  projectId: string;
  url: string;
  title?: string;
  actorEmployeeId?: string;
}

export class RemoveProjectMemberDto {
  id: string;
  actorEmployeeId?: string;
}

export class RemoveProjectFileDto {
  id: string;
  actorEmployeeId?: string;
}

export class RemoveProjectLinkDto {
  id: string;
  actorEmployeeId?: string;
}
