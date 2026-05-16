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
}

export class AddProjectMemberDto {
  projectId: string;
  employeeId: string;
  role: ProjectMemberRole;
}

export class AddProjectFileDto {
  projectId: string;
  url: string;
  name: string;
  mimeType?: string;
  size?: number;
}

export class AddProjectLinkDto {
  projectId: string;
  url: string;
  title?: string;
}
