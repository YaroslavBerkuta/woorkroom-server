import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
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
import {
  IGrpcProjectsService,
  IProjectFilter,
  IProjectsConnection,
} from '../types';

interface ProjectListResponse {
  projects: IProject[];
}
interface ProjectMemberListResponse {
  members: IProjectMember[];
}
interface ProjectFileListResponse {
  files: IProjectFile[];
}
interface ProjectLinkListResponse {
  links: IProjectLink[];
}
interface BoolResponse {
  value: boolean;
}

interface ProjectMemberResponse {
  id: string;
  projectId: string;
  employeeId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsGrpcClient {
  createProject(data: unknown): Observable<IProject>;
  getProject(data: unknown): Observable<IProject>;
  getMyProjectsPaginated(data: unknown): Observable<IProjectsConnection>;
  getMyProjects(data: unknown): Observable<ProjectListResponse>;
  getProjectFilesBatch(data: unknown): Observable<ProjectFileListResponse>;
  getProjectLinksBatch(data: unknown): Observable<ProjectLinkListResponse>;
  getCompanyProjects(data: unknown): Observable<ProjectListResponse>;
  getProjectMembers(data: unknown): Observable<ProjectMemberListResponse>;
  addProjectMember(data: unknown): Observable<ProjectMemberResponse>;
  removeProjectMember(data: unknown): Observable<BoolResponse>;
  updateProject(data: unknown): Observable<IProject>;
  updateProjectStatus(data: unknown): Observable<IProject>;
  addProjectFile(data: unknown): Observable<IProjectFile>;
  removeProjectFile(data: unknown): Observable<BoolResponse>;
  getProjectFiles(data: unknown): Observable<ProjectFileListResponse>;
  addProjectLink(data: unknown): Observable<IProjectLink>;
  removeProjectLink(data: unknown): Observable<BoolResponse>;
  getProjectLinks(data: unknown): Observable<ProjectLinkListResponse>;
}

@Injectable()
export class GrpcProjectsService implements IGrpcProjectsService, OnModuleInit {
  private client: ProjectsGrpcClient;

  constructor(
    @Inject('PROJECTS_GRPC_CLIENT') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.client =
      this.grpcClient.getService<ProjectsGrpcClient>('ProjectsService');
  }

  async createProject(dto: CreateProjectDto): Promise<IProject> {
    return lastValueFrom(this.client.createProject(dto));
  }

  async getMyProjectsPaginated(dto: {
    companyId: string;
    employeeId: string;
    first?: number;
    after?: string;
    filter?: IProjectFilter;
  }): Promise<IProjectsConnection> {
    return lastValueFrom(this.client.getMyProjectsPaginated(dto));
  }

  async getProject(id: string): Promise<IProject> {
    return lastValueFrom(this.client.getProject({ id }));
  }

  async getMyProjects(
    companyId: string,
    employeeId: string,
  ): Promise<IProject[]> {
    const res = await lastValueFrom(
      this.client.getMyProjects({ companyId, employeeId }),
    );
    return res.projects ?? [];
  }

  async getCompanyProjects(companyId: string): Promise<IProject[]> {
    const res = await lastValueFrom(
      this.client.getCompanyProjects({ id: companyId }),
    );
    return res.projects ?? [];
  }

  async getProjectMembers(projectId: string): Promise<IProjectMember[]> {
    const res = await lastValueFrom(
      this.client.getProjectMembers({ id: projectId }),
    );
    return res.members ?? [];
  }

  async addProjectMember(dto: AddProjectMemberDto): Promise<IProjectMember> {
    return lastValueFrom(
      this.client.addProjectMember(dto),
    ) as unknown as Promise<IProjectMember>;
  }

  async removeProjectMember(dto: {
    id: string;
    actorEmployeeId?: string;
  }): Promise<boolean> {
    const res = await lastValueFrom(
      this.client.removeProjectMember(dto),
    );
    return res.value;
  }

  async updateProject(dto: UpdateProjectDto): Promise<IProject> {
    return lastValueFrom(this.client.updateProject(dto));
  }

  async updateProjectStatus(
    id: string,
    status: ProjectStatus,
    actorEmployeeId?: string,
  ): Promise<IProject> {
    return lastValueFrom(
      this.client.updateProjectStatus({ id, status, actorEmployeeId }),
    );
  }

  async addProjectFile(dto: AddProjectFileDto): Promise<IProjectFile> {
    return lastValueFrom(this.client.addProjectFile(dto));
  }

  async removeProjectFile(dto: {
    id: string;
    actorEmployeeId?: string;
  }): Promise<boolean> {
    const res = await lastValueFrom(this.client.removeProjectFile(dto));
    return res.value;
  }

  async getProjectFiles(projectId: string): Promise<IProjectFile[]> {
    const res = await lastValueFrom(
      this.client.getProjectFiles({ id: projectId }),
    );
    return res.files ?? [];
  }

  async getProjectFilesBatch(projectIds: string[]): Promise<IProjectFile[]> {
    const res = await lastValueFrom(
      this.client.getProjectFilesBatch({ projectIds }),
    );
    return res.files ?? [];
  }

  async addProjectLink(dto: AddProjectLinkDto): Promise<IProjectLink> {
    return lastValueFrom(this.client.addProjectLink(dto));
  }

  async removeProjectLink(dto: {
    id: string;
    actorEmployeeId?: string;
  }): Promise<boolean> {
    const res = await lastValueFrom(this.client.removeProjectLink(dto));
    return res.value;
  }

  async getProjectLinks(projectId: string): Promise<IProjectLink[]> {
    const res = await lastValueFrom(
      this.client.getProjectLinks({ id: projectId }),
    );
    return res.links ?? [];
  }

  async getProjectLinksBatch(projectIds: string[]): Promise<IProjectLink[]> {
    const res = await lastValueFrom(
      this.client.getProjectLinksBatch({ projectIds }),
    );
    return res.links ?? [];
  }
}
