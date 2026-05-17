import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProjectService } from '@/services';
import {
  AddProjectFileDto,
  AddProjectLinkDto,
  AddProjectMemberDto,
  CreateProjectDto,
  UpdateProjectDto,
  UpdateProjectStatusDto,
} from 'shared';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @GrpcMethod('ProjectsService', 'CreateProject')
  createProject(dto: CreateProjectDto) {
    return this.projectService.createProject(dto);
  }

  @GrpcMethod('ProjectsService', 'GetMyProjectsPaginated')
  getMyProjectsPaginated(dto: {
    companyId: string;
    employeeId: string;
    first?: number;
    after?: string;
    filter?: Record<string, unknown>;
  }) {
    return this.projectService.getMyProjectsPaginated(dto);
  }

  @GrpcMethod('ProjectsService', 'GetMyProjects')
  async getMyProjects(dto: { companyId: string; employeeId: string }) {
    const projects = await this.projectService.getMyProjects(
      dto.companyId,
      dto.employeeId,
    );
    return { projects };
  }

  @GrpcMethod('ProjectsService', 'GetCompanyProjects')
  async getCompanyProjects(dto: { id: string }) {
    const projects = await this.projectService.getCompanyProjects(dto.id);
    return { projects };
  }

  @GrpcMethod('ProjectsService', 'GetProjectMembers')
  async getProjectMembers(dto: { id: string }) {
    const members = await this.projectService.getProjectMembers(dto.id);
    return { members };
  }

  @GrpcMethod('ProjectsService', 'GetProject')
  getProject(dto: { id: string }) {
    return this.projectService.getProject(dto.id);
  }

  @GrpcMethod('ProjectsService', 'UpdateProject')
  updateProject(dto: UpdateProjectDto) {
    return this.projectService.updateProject(dto);
  }

  @GrpcMethod('ProjectsService', 'UpdateProjectStatus')
  updateProjectStatus(dto: UpdateProjectStatusDto) {
    return this.projectService.updateProjectStatus(dto);
  }

  @GrpcMethod('ProjectsService', 'AddProjectMember')
  addProjectMember(dto: AddProjectMemberDto) {
    return this.projectService.addProjectMember(dto);
  }

  @GrpcMethod('ProjectsService', 'RemoveProjectMember')
  async removeProjectMember(dto: { id: string }) {
    const value = await this.projectService.removeProjectMember(dto.id);
    return { value };
  }

  @GrpcMethod('ProjectsService', 'AddProjectFile')
  addProjectFile(dto: AddProjectFileDto) {
    return this.projectService.addProjectFile(dto);
  }

  @GrpcMethod('ProjectsService', 'RemoveProjectFile')
  async removeProjectFile(dto: { id: string }) {
    const value = await this.projectService.removeProjectFile(dto.id);
    return { value };
  }

  @GrpcMethod('ProjectsService', 'GetProjectFiles')
  async getProjectFiles(dto: { id: string }) {
    const files = await this.projectService.getProjectFiles(dto.id);
    return { files };
  }

  @GrpcMethod('ProjectsService', 'GetProjectFilesBatch')
  async getProjectFilesBatch(dto: { projectIds: string[] }) {
    const files = await this.projectService.getProjectFilesBatch(
      dto.projectIds ?? [],
    );
    return { files };
  }

  @GrpcMethod('ProjectsService', 'AddProjectLink')
  addProjectLink(dto: AddProjectLinkDto) {
    return this.projectService.addProjectLink(dto);
  }

  @GrpcMethod('ProjectsService', 'RemoveProjectLink')
  async removeProjectLink(dto: { id: string }) {
    const value = await this.projectService.removeProjectLink(dto.id);
    return { value };
  }

  @GrpcMethod('ProjectsService', 'GetProjectLinks')
  async getProjectLinks(dto: { id: string }) {
    const links = await this.projectService.getProjectLinks(dto.id);
    return { links };
  }

  @GrpcMethod('ProjectsService', 'GetProjectLinksBatch')
  async getProjectLinksBatch(dto: { projectIds: string[] }) {
    const links = await this.projectService.getProjectLinksBatch(
      dto.projectIds ?? [],
    );
    return { links };
  }
}
