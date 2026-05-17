import {
  AddProjectFileDto,
  AddProjectLinkDto,
  AddProjectMemberDto,
  CreateProjectDto,
  IProject,
  IProjectFile,
  IProjectLink,
  IProjectMember,
  ProjectStatus,
  UpdateProjectDto,
} from 'shared';

export interface IProjectFilter {
  name?: string;
  slug?: string;
  priority?: string[];
  status?: string[];
  reporterIds?: string[];
  assigneeIds?: string[];
  startsFrom?: string;
  startsTo?: string;
  deadlineFrom?: string;
  deadlineTo?: string;
}

export interface IProjectsConnection {
  edges: { node: IProject; cursor: string }[];
  pageInfo: { hasNextPage: boolean; endCursor: string };
  totalCount: number;
}

export interface IGrpcProjectsService {
  createProject(dto: CreateProjectDto): Promise<IProject>;
  getProject(id: string): Promise<IProject>;
  getMyProjectsPaginated(dto: {
    companyId: string;
    employeeId: string;
    first?: number;
    after?: string;
    filter?: IProjectFilter;
  }): Promise<IProjectsConnection>;
  getMyProjects(companyId: string, employeeId: string): Promise<IProject[]>;
  getCompanyProjects(companyId: string): Promise<IProject[]>;
  getProjectMembers(projectId: string): Promise<IProjectMember[]>;
  addProjectMember(dto: AddProjectMemberDto): Promise<IProjectMember>;
  removeProjectMember(memberId: string): Promise<boolean>;
  updateProject(dto: UpdateProjectDto): Promise<IProject>;
  updateProjectStatus(id: string, status: ProjectStatus): Promise<IProject>;
  addProjectFile(dto: AddProjectFileDto): Promise<IProjectFile>;
  removeProjectFile(id: string): Promise<boolean>;
  getProjectFiles(projectId: string): Promise<IProjectFile[]>;
  getProjectFilesBatch(projectIds: string[]): Promise<IProjectFile[]>;
  addProjectLink(dto: AddProjectLinkDto): Promise<IProjectLink>;
  removeProjectLink(id: string): Promise<boolean>;
  getProjectLinks(projectId: string): Promise<IProjectLink[]>;
  getProjectLinksBatch(projectIds: string[]): Promise<IProjectLink[]>;
}
