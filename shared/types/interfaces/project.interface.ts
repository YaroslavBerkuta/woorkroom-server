import { ProjectMemberRole, ProjectPriority } from '../enums';
import { IBase } from './base.interface';

export interface IProject extends IBase {
  companyId: string;
  name: string;
  slug: string;
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
