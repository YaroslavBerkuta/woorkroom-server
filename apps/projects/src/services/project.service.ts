import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Project } from '../entitys/project.entity';
import { ProjectMember } from '../entitys/project-member.entity';
import { CreateProjectDto } from 'shared';
import { ProjectMemberRole } from 'shared';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
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

  private async resolveSlug(companyId: string, name: string): Promise<string> {
    const base = this.toSlug(name);
    const existing = await this.projectRepo.find({
      where: { companyId },
      select: ['slug'],
    });
    const slugSet = new Set(existing.map((p) => p.slug));

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
}
