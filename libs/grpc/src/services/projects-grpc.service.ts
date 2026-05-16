import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { CreateProjectDto, IProject, IProjectMember, ProjectStatus } from 'shared';
import { IGrpcProjectsService } from '../types';

interface ProjectListResponse {
  projects: IProject[];
}

interface ProjectMemberListResponse {
  members: IProjectMember[];
}

interface ProjectsGrpcClient {
  createProject(data: unknown): Observable<IProject>;
  getMyProjects(data: unknown): Observable<ProjectListResponse>;
  getCompanyProjects(data: unknown): Observable<ProjectListResponse>;
  getProjectMembers(data: unknown): Observable<ProjectMemberListResponse>;
  updateProjectStatus(data: unknown): Observable<IProject>;
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
}
