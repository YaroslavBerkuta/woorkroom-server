import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProjectService } from '../services';
import { CreateProjectDto, UpdateProjectStatusDto } from 'shared';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @GrpcMethod('ProjectsService', 'CreateProject')
  createProject(dto: CreateProjectDto) {
    return this.projectService.createProject(dto);
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

  @GrpcMethod('ProjectsService', 'UpdateProjectStatus')
  updateProjectStatus(dto: UpdateProjectStatusDto) {
    return this.projectService.updateProjectStatus(dto);
  }
}
