import { CreateProjectDto, IProject, IProjectMember, ProjectStatus, UpdateProjectStatusDto } from 'shared';

export interface IGrpcProjectsService {
  createProject(dto: CreateProjectDto): Promise<IProject>;
  getMyProjects(companyId: string, employeeId: string): Promise<IProject[]>;
  getCompanyProjects(companyId: string): Promise<IProject[]>;
  getProjectMembers(projectId: string): Promise<IProjectMember[]>;
  updateProjectStatus(id: string, status: ProjectStatus): Promise<IProject>;
}
