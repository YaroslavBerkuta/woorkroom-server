import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Project } from '../entitys/project.entity';
import { ProjectMember } from '../entitys/project-member.entity';
import { ProjectFile } from '../entitys/project-file.entity';
import { ProjectLink } from '../entitys/project-link.entity';
import { AddProjectFileDto, AddProjectLinkDto, CreateProjectDto, UpdateProjectDto, UpdateProjectStatusDto } from 'shared';
import { ProjectMemberRole } from 'shared';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
    @InjectRepository(ProjectFile)
    private readonly fileRepo: Repository<ProjectFile>,
    @InjectRepository(ProjectLink)
    private readonly linkRepo: Repository<ProjectLink>,
  ) {}

  private toSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private async resolveSlug(companyId: string, name: string, excludeId?: string): Promise<string> {
    const base = this.toSlug(name);
    const existing = await this.projectRepo.find({
      where: { companyId },
      select: ['id', 'slug'],
    });
    const slugSet = new Set(existing.filter((p) => p.id !== excludeId).map((p) => p.slug));

    if (!slugSet.has(base)) return base;

    let counter = 2;
    while (slugSet.has(`${base}-${counter}`)) counter++;
    return `${base}-${counter}`;
  }

  async createProject(dto: CreateProjectDto): Promise<Project> {
    const slug = await this.resolveSlug(dto.companyId, dto.name);

    const project = await this.projectRepo.save({
      companyId: dto.companyId,
      name: dto.name,
      slug,
      starts: dto.starts || undefined,
      deadline: dto.deadline || undefined,
      priority: dto.priority || undefined,
      description: dto.description || undefined,
      image: dto.image || undefined,
    });

    const reporterId = dto.reporterId || dto.creatorEmployeeId;

    const members: Partial<ProjectMember>[] = [];

    if (reporterId) {
      members.push({
        projectId: project.id,
        employeeId: reporterId,
        role: ProjectMemberRole.REPORTER,
      });
    }

    if (dto.assigneeIds?.length) {
      for (const employeeId of dto.assigneeIds) {
        if (employeeId !== reporterId) {
          members.push({
            projectId: project.id,
            employeeId,
            role: ProjectMemberRole.ASSIGNEE,
          });
        }
      }
    }

    if (members.length) {
      await this.memberRepo.save(members);
    }

    return project;
  }

  async getMyProjects(companyId: string, employeeId: string): Promise<Project[]> {
    const memberships = await this.memberRepo.find({ where: { employeeId } });
    const projectIds = memberships.map((m) => m.projectId);

    if (!projectIds.length) return [];

    return this.projectRepo.find({
      where: { companyId, id: In(projectIds) },
      order: { createdAt: 'DESC' },
    });
  }

  async getCompanyProjects(companyId: string): Promise<Project[]> {
    return this.projectRepo.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project) throw new RpcException('Project not found');
    return this.memberRepo.find({ where: { projectId } });
  }

  async getProject(id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new RpcException('Project not found');
    return project;
  }

  async updateProject(dto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id: dto.id } });
    if (!project) throw new RpcException('Project not found');

    if (dto.name && dto.name !== project.name) {
      project.name = dto.name;
      project.slug = await this.resolveSlug(project.companyId, dto.name, project.id);
    }
    if (dto.starts !== undefined) project.starts = dto.starts || undefined;
    if (dto.deadline !== undefined) project.deadline = dto.deadline || undefined;
    if (dto.priority !== undefined) project.priority = dto.priority || undefined;
    if (dto.description !== undefined) project.description = dto.description || undefined;
    if (dto.image !== undefined) project.image = dto.image || undefined;

    return this.projectRepo.save(project);
  }

  async updateProjectStatus(dto: UpdateProjectStatusDto): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id: dto.id } });
    if (!project) throw new RpcException('Project not found');
    project.status = dto.status;
    return this.projectRepo.save(project);
  }

  async addProjectFile(dto: AddProjectFileDto): Promise<ProjectFile> {
    return this.fileRepo.save({
      projectId: dto.projectId,
      url: dto.url,
      name: dto.name,
      mimeType: dto.mimeType || undefined,
      size: dto.size || undefined,
    });
  }

  async removeProjectFile(id: string): Promise<boolean> {
    const file = await this.fileRepo.findOne({ where: { id } });
    if (!file) throw new RpcException('File not found');
    await this.fileRepo.remove(file);
    return true;
  }

  async getProjectFiles(projectId: string): Promise<ProjectFile[]> {
    return this.fileRepo.find({ where: { projectId }, order: { createdAt: 'ASC' } });
  }

  async addProjectLink(dto: AddProjectLinkDto): Promise<ProjectLink> {
    return this.linkRepo.save({
      projectId: dto.projectId,
      url: dto.url,
      title: dto.title || undefined,
    });
  }

  async removeProjectLink(id: string): Promise<boolean> {
    const link = await this.linkRepo.findOne({ where: { id } });
    if (!link) throw new RpcException('Link not found');
    await this.linkRepo.remove(link);
    return true;
  }

  async getProjectLinks(projectId: string): Promise<ProjectLink[]> {
    return this.linkRepo.find({ where: { projectId }, order: { createdAt: 'ASC' } });
  }
}
