import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { AddProjectFileDto, AddProjectLinkDto, CreateProjectDto, IProject, IProjectFile, IProjectLink, IProjectMember, ProjectStatus } from 'shared';
import { IGrpcProjectsService } from '../types';

interface ProjectListResponse { projects: IProject[]; }
interface ProjectMemberListResponse { members: IProjectMember[]; }
interface ProjectFileListResponse { files: IProjectFile[]; }
interface ProjectLinkListResponse { links: IProjectLink[]; }
interface BoolResponse { value: boolean; }

interface ProjectsGrpcClient {
  createProject(data: unknown): Observable<IProject>;
  getMyProjects(data: unknown): Observable<ProjectListResponse>;
  getCompanyProjects(data: unknown): Observable<ProjectListResponse>;
  getProjectMembers(data: unknown): Observable<ProjectMemberListResponse>;
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

  async getMyProjects(companyId: string, employeeId: string): Promise<IProject[]> {
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

  async updateProjectStatus(id: string, status: ProjectStatus): Promise<IProject> {
    return lastValueFrom(this.client.updateProjectStatus({ id, status }));
  }

  async addProjectFile(dto: AddProjectFileDto): Promise<IProjectFile> {
    return lastValueFrom(this.client.addProjectFile(dto));
  }

  async removeProjectFile(id: string): Promise<boolean> {
    const res = await lastValueFrom(this.client.removeProjectFile({ id }));
    return res.value;
  }

  async getProjectFiles(projectId: string): Promise<IProjectFile[]> {
    const res = await lastValueFrom(this.client.getProjectFiles({ id: projectId }));
    return res.files ?? [];
  }

  async addProjectLink(dto: AddProjectLinkDto): Promise<IProjectLink> {
    return lastValueFrom(this.client.addProjectLink(dto));
  }

  async removeProjectLink(id: string): Promise<boolean> {
    const res = await lastValueFrom(this.client.removeProjectLink({ id }));
    return res.value;
  }

  async getProjectLinks(projectId: string): Promise<IProjectLink[]> {
    const res = await lastValueFrom(this.client.getProjectLinks({ id: projectId }));
    return res.links ?? [];
  }
}
