import { ProjectMemberRole, ProjectPriority, ProjectStatus } from '../enums';
import { IBase } from './base.interface';

export interface IProject extends IBase {
  companyId: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  starts?: string;
  deadline?: string;
  priority?: ProjectPriority;
  description?: string;
  image?: string;
}

export interface IProjectMember extends IBase {
  projectId: string;
  employeeId: string;
  role: ProjectMemberRole;
}

export interface IProjectFile extends IBase {
  projectId: string;
  url: string;
  name: string;
  mimeType?: string;
  size?: number;
}

export interface IProjectLink extends IBase {
  projectId: string;
  url: string;
  title?: string;
}
