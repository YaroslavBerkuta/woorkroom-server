import { AddProjectFileDto, AddProjectLinkDto, CreateProjectDto, IProject, IProjectFile, IProjectLink, IProjectMember, ProjectStatus, UpdateProjectDto } from 'shared';

export interface IGrpcProjectsService {
  createProject(dto: CreateProjectDto): Promise<IProject>;
  getMyProjects(companyId: string, employeeId: string): Promise<IProject[]>;
  getCompanyProjects(companyId: string): Promise<IProject[]>;
  getProjectMembers(projectId: string): Promise<IProjectMember[]>;
  updateProject(dto: UpdateProjectDto): Promise<IProject>;
  updateProjectStatus(id: string, status: ProjectStatus): Promise<IProject>;
  addProjectFile(dto: AddProjectFileDto): Promise<IProjectFile>;
  removeProjectFile(id: string): Promise<boolean>;
  getProjectFiles(projectId: string): Promise<IProjectFile[]>;
  addProjectLink(dto: AddProjectLinkDto): Promise<IProjectLink>;
  removeProjectLink(id: string): Promise<boolean>;
  getProjectLinks(projectId: string): Promise<IProjectLink[]>;
}
