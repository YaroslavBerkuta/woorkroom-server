import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Project } from '../entitys/project.entity';
import { ProjectMember } from '../entitys/project-member.entity';
import { ProjectFile } from '../entitys/project-file.entity';
import { ProjectLink } from '../entitys/project-link.entity';
import { AddProjectFileDto, AddProjectLinkDto, CreateProjectDto, UpdateProjectDto, UpdateProjectStatusDto } from 'shared';
import { ProjectMemberRole, ProjectPriority, toBaseSlug, resolveUniqueSlug } from 'shared';
import { RpcException } from '@nestjs/microservices';

interface ProjectFilter {
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

interface GetMyProjectsPaginatedDto {
  companyId: string;
  employeeId: string;
  first?: number;
  after?: string;
  filter?: ProjectFilter;
}

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

  private async resolveSlug(companyId: string, name: string, excludeId?: string): Promise<string> {
    const base = toBaseSlug(name);
    const existing = await this.projectRepo.find({
      where: { companyId },
      select: ['id', 'slug'],
    });
    const existingSlugs = existing
      .filter((p) => p.id !== excludeId)
      .map((p) => p.slug);
    return resolveUniqueSlug(base, existingSlugs);
  }

  async createProject(dto: CreateProjectDto): Promise<Project> {
    const slug = await this.resolveSlug(dto.companyId, dto.name);

    const project = await this.projectRepo.save({
      companyId: dto.companyId,
      name: dto.name,
      slug,
      starts: dto.starts || undefined,
      deadline: dto.deadline || undefined,
      priority: dto.priority ?? ProjectPriority.LOW,
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

  async getMyProjectsPaginated(dto: GetMyProjectsPaginatedDto) {
    const { companyId, employeeId, filter = {} } = dto;
    const first = Math.min(dto.first || 20, 100);

    const memberships = await this.memberRepo.find({ where: { employeeId } });
    let projectIds = memberships.map((m) => m.projectId);

    if (!projectIds.length) {
      return { edges: [], pageInfo: { hasNextPage: false, endCursor: '' }, totalCount: 0 };
    }

    if (filter.reporterIds?.length || filter.assigneeIds?.length) {
      const parts: string[] = [];
      const params: Record<string, unknown> = {};
      if (filter.reporterIds?.length) {
        parts.push(`(pm.employeeId IN (:...reporterIds) AND pm.role = '${ProjectMemberRole.REPORTER}')`);
        params.reporterIds = filter.reporterIds;
      }
      if (filter.assigneeIds?.length) {
        parts.push(`(pm.employeeId IN (:...assigneeIds) AND pm.role = '${ProjectMemberRole.ASSIGNEE}')`);
        params.assigneeIds = filter.assigneeIds;
      }
      const rows = await this.memberRepo
        .createQueryBuilder('pm')
        .select('DISTINCT pm.projectId', 'projectId')
        .where(parts.join(' OR '), params)
        .getRawMany<{ projectId: string }>();
      const memberProjectIds = new Set(rows.map((r) => r.projectId));
      projectIds = projectIds.filter((id) => memberProjectIds.has(id));
    }

    if (!projectIds.length) {
      return { edges: [], pageInfo: { hasNextPage: false, endCursor: '' }, totalCount: 0 };
    }

    const qb = this.projectRepo
      .createQueryBuilder('p')
      .where('p.companyId = :companyId', { companyId })
      .andWhere('p.id IN (:...projectIds)', { projectIds });

    if (filter.name) qb.andWhere('p.name ILIKE :name', { name: `%${filter.name}%` });
    if (filter.slug) qb.andWhere('p.slug ILIKE :slug', { slug: `%${filter.slug}%` });
    if (filter.priority?.length) qb.andWhere('p.priority IN (:...priority)', { priority: filter.priority });
    if (filter.status?.length) qb.andWhere('p.status IN (:...status)', { status: filter.status });
    if (filter.startsFrom) qb.andWhere('p.starts >= :startsFrom', { startsFrom: filter.startsFrom });
    if (filter.startsTo) qb.andWhere('p.starts <= :startsTo', { startsTo: filter.startsTo });
    if (filter.deadlineFrom) qb.andWhere('p.deadline >= :deadlineFrom', { deadlineFrom: filter.deadlineFrom });
    if (filter.deadlineTo) qb.andWhere('p.deadline <= :deadlineTo', { deadlineTo: filter.deadlineTo });

    const totalCount = await qb.clone().getCount();

    if (dto.after) {
      const decoded = Buffer.from(dto.after, 'base64').toString('utf-8');
      const colonIdx = decoded.lastIndexOf(':');
      const cursorDate = decoded.substring(0, colonIdx);
      const cursorId = decoded.substring(colonIdx + 1);
      qb.andWhere(
        '(p.createdAt < :cursorDate OR (p.createdAt = :cursorDate AND p.id < :cursorId))',
        { cursorDate, cursorId },
      );
    }

    qb.orderBy('p.createdAt', 'DESC').addOrderBy('p.id', 'DESC').take(first + 1);

    const items = await qb.getMany();
    const hasNextPage = items.length > first;
    const pageItems = items.slice(0, first);

    const edges = pageItems.map((p) => ({
      node: p,
      cursor: Buffer.from(`${p.createdAt.toISOString()}:${p.id}`).toString('base64'),
    }));

    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : '';

    return { edges, pageInfo: { hasNextPage, endCursor }, totalCount };
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

  async getProjectFilesBatch(projectIds: string[]): Promise<ProjectFile[]> {
    return this.fileRepo.find({ where: { projectId: In(projectIds) }, order: { createdAt: 'ASC' } });
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

  async getProjectLinksBatch(projectIds: string[]): Promise<ProjectLink[]> {
    return this.linkRepo.find({ where: { projectId: In(projectIds) }, order: { createdAt: 'ASC' } });
  }
}
