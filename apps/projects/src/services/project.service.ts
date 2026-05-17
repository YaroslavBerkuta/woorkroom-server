import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { In, Repository } from 'typeorm';
import { Model } from 'mongoose';
import { difference, differenceBy, isEmpty } from 'lodash';

import { Project } from '../entitys/project.entity';
import { ProjectMember } from '../entitys/project-member.entity';
import {
  ProjectFile,
  ProjectFileDocument,
} from '../schemas/project-file.schema';
import {
  ProjectLink,
  ProjectLinkDocument,
} from '../schemas/project-link.schema';
import {
  AddProjectFileDto,
  AddProjectLinkDto,
  AddProjectMemberDto,
  CreateProjectDto,
  RemoveProjectFileDto,
  RemoveProjectLinkDto,
  RemoveProjectMemberDto,
  UpdateProjectDto,
  UpdateProjectStatusDto,
} from 'shared';
import {
  AuditAction,
  ProjectMemberRole,
  ProjectPriority,
  toBaseSlug,
  resolveUniqueSlug,
} from 'shared';
import { RpcException } from '@nestjs/microservices';
import * as redis from 'woorkroom/redis';
import { RabbitmqActivityService } from 'woorkroom/rabbitmq';

interface UpdateProjectServiceDto extends UpdateProjectDto {
  updateAssignees?: boolean;
  updateReporter?: boolean;
}

type FieldChange = { from: string | null; to: string | null };
type ProjectFieldChanges = Partial<
  Record<'name' | 'starts' | 'deadline' | 'priority' | 'description' | 'image', FieldChange>
>;

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
    @InjectModel(ProjectFile.name)
    private readonly fileModel: Model<ProjectFileDocument>,
    @InjectModel(ProjectLink.name)
    private readonly linkModel: Model<ProjectLinkDocument>,
    @Inject(redis.RedisService.name)
    private readonly redis: redis.IRedisService,
    @Inject(RabbitmqActivityService.name)
    private readonly rabbitmqAudit: RabbitmqActivityService,
  ) {}

  private async resolveSlug(
    companyId: string,
    name: string,
    excludeId?: string,
  ): Promise<string> {
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
      return {
        edges: [],
        pageInfo: { hasNextPage: false, endCursor: '' },
        totalCount: 0,
      };
    }

    if (filter.reporterIds?.length || filter.assigneeIds?.length) {
      const parts: string[] = [];
      const params: Record<string, unknown> = {};
      if (filter.reporterIds?.length) {
        parts.push(
          `(pm.employeeId IN (:...reporterIds) AND pm.role = '${ProjectMemberRole.REPORTER}')`,
        );
        params.reporterIds = filter.reporterIds;
      }
      if (filter.assigneeIds?.length) {
        parts.push(
          `(pm.employeeId IN (:...assigneeIds) AND pm.role = '${ProjectMemberRole.ASSIGNEE}')`,
        );
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
      return {
        edges: [],
        pageInfo: { hasNextPage: false, endCursor: '' },
        totalCount: 0,
      };
    }

    const qb = this.projectRepo
      .createQueryBuilder('p')
      .where('p.companyId = :companyId', { companyId })
      .andWhere('p.id IN (:...projectIds)', { projectIds });

    if (filter.name)
      qb.andWhere('p.name ILIKE :name', { name: `%${filter.name}%` });
    if (filter.slug)
      qb.andWhere('p.slug ILIKE :slug', { slug: `%${filter.slug}%` });
    if (filter.priority?.length)
      qb.andWhere('p.priority IN (:...priority)', {
        priority: filter.priority,
      });
    if (filter.status?.length)
      qb.andWhere('p.status IN (:...status)', { status: filter.status });
    if (filter.startsFrom)
      qb.andWhere('p.starts >= :startsFrom', { startsFrom: filter.startsFrom });
    if (filter.startsTo)
      qb.andWhere('p.starts <= :startsTo', { startsTo: filter.startsTo });
    if (filter.deadlineFrom)
      qb.andWhere('p.deadline >= :deadlineFrom', {
        deadlineFrom: filter.deadlineFrom,
      });
    if (filter.deadlineTo)
      qb.andWhere('p.deadline <= :deadlineTo', {
        deadlineTo: filter.deadlineTo,
      });

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

    qb.orderBy('p.createdAt', 'DESC')
      .addOrderBy('p.id', 'DESC')
      .take(first + 1);

    const items = await qb.getMany();
    const hasNextPage = items.length > first;
    const pageItems = items.slice(0, first);

    const edges = pageItems.map((p) => ({
      node: p,
      cursor: Buffer.from(`${p.createdAt.toISOString()}:${p.id}`).toString(
        'base64',
      ),
    }));

    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : '';

    return { edges, pageInfo: { hasNextPage, endCursor }, totalCount };
  }

  async getMyProjects(
    companyId: string,
    employeeId: string,
  ): Promise<Project[]> {
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
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });
    if (!project) throw new RpcException('Project not found');
    return this.memberRepo.find({ where: { projectId } });
  }

  async getProject(id: string): Promise<Project> {
    const cached = await this.redis.get<Project>(`project:${id}`);
    if (cached) return cached;

    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new RpcException('Project not found');

    await this.redis.ttl(`project:${id}`, project, 60);
    return project;
  }

  async updateProject(dto: UpdateProjectServiceDto): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id: dto.id } });
    if (!project) throw new RpcException('Project not found');

    const changes = await this.applyScalarChanges(dto, project);
    const saved = await this.projectRepo.save(project);
    await this.redis.del(`project:${dto.id}`);

    if (!isEmpty(changes)) {
      this.rabbitmqAudit.publish({
        service: 'projects',
        action: AuditAction.PROJECT_UPDATED,
        actorEmployeeId: dto.actorEmployeeId ?? '',
        resourceId: dto.id,
        meta: { changes },
      });
    }

    if (dto.updateReporter) {
      await this.syncReporter(dto.id, dto.reporterId, dto.actorEmployeeId);
    }
    if (dto.updateAssignees) {
      await this.syncAssignees(dto.id, dto.assigneeIds ?? [], dto.actorEmployeeId);
    }

    return saved;
  }

  private async applyScalarChanges(
    dto: UpdateProjectDto,
    project: Project,
  ): Promise<ProjectFieldChanges> {
    const changes: ProjectFieldChanges = {};

    if (dto.name && dto.name !== project.name) {
      changes.name = { from: project.name, to: dto.name };
      project.name = dto.name;
      project.slug = await this.resolveSlug(project.companyId, dto.name, project.id);
    }

    const nullableFields = ['starts', 'deadline', 'priority', 'description', 'image'] as const;
    for (const field of nullableFields) {
      const incoming = dto[field];
      if (incoming === undefined) continue;
      const current = (project[field] ?? null) as string | null;
      const next = (incoming || null) as string | null;
      if (next !== current) {
        changes[field] = { from: current, to: next };
        (project[field] as string | undefined) = incoming || undefined;
      }
    }

    return changes;
  }

  private async syncReporter(
    projectId: string,
    reporterId: string | undefined,
    actorEmployeeId: string | undefined,
  ): Promise<void> {
    const prev = await this.memberRepo.findOne({
      where: { projectId, role: ProjectMemberRole.REPORTER },
    });
    if (prev?.employeeId === reporterId) return;

    await this.memberRepo.delete({ projectId, role: ProjectMemberRole.REPORTER });
    if (!reporterId) return;

    await this.memberRepo.save({ projectId, employeeId: reporterId, role: ProjectMemberRole.REPORTER });
    this.rabbitmqAudit.publish({
      service: 'projects',
      action: AuditAction.PROJECT_MEMBER_ADDED,
      actorEmployeeId: actorEmployeeId ?? '',
      resourceId: projectId,
      meta: {
        employeeId: reporterId,
        role: ProjectMemberRole.REPORTER,
        ...(prev ? { replacedEmployeeId: prev.employeeId } : {}),
      },
    });
  }

  private async syncAssignees(
    projectId: string,
    newAssigneeIds: string[],
    actorEmployeeId: string | undefined,
  ): Promise<void> {
    const current = await this.memberRepo.find({
      where: { projectId, role: ProjectMemberRole.ASSIGNEE },
    });

    const toRemove = differenceBy(
      current,
      newAssigneeIds.map((id) => ({ employeeId: id })),
      'employeeId',
    );
    const toAdd = difference(
      newAssigneeIds,
      current.map((m) => m.employeeId),
    );

    await Promise.all([
      ...toRemove.map(async (member) => {
        await this.memberRepo.delete({ id: member.id });
        this.rabbitmqAudit.publish({
          service: 'projects',
          action: AuditAction.PROJECT_MEMBER_REMOVED,
          actorEmployeeId: actorEmployeeId ?? '',
          resourceId: projectId,
          meta: { employeeId: member.employeeId, role: ProjectMemberRole.ASSIGNEE },
        });
      }),
      ...toAdd.map(async (employeeId) => {
        await this.memberRepo.save({ projectId, employeeId, role: ProjectMemberRole.ASSIGNEE });
        this.rabbitmqAudit.publish({
          service: 'projects',
          action: AuditAction.PROJECT_MEMBER_ADDED,
          actorEmployeeId: actorEmployeeId ?? '',
          resourceId: projectId,
          meta: { employeeId, role: ProjectMemberRole.ASSIGNEE },
        });
      }),
    ]);
  }

  async updateProjectStatus(dto: UpdateProjectStatusDto): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id: dto.id } });
    if (!project) throw new RpcException('Project not found');
    project.status = dto.status;
    const saved = await this.projectRepo.save(project);
    await this.redis.del(`project:${dto.id}`);

    this.rabbitmqAudit.publish({
      service: 'projects',
      action: AuditAction.PROJECT_STATUS_UPDATED,
      actorEmployeeId: dto.actorEmployeeId ?? '',
      resourceId: dto.id,
      meta: { status: dto.status },
    });

    return saved;
  }

  async addProjectMember(dto: AddProjectMemberDto): Promise<ProjectMember> {
    let replacedEmployeeId: string | undefined;

    if (dto.role === ProjectMemberRole.REPORTER) {
      const prevReporter = await this.memberRepo.findOne({
        where: { projectId: dto.projectId, role: ProjectMemberRole.REPORTER },
      });
      replacedEmployeeId = prevReporter?.employeeId;
      await this.memberRepo.delete({
        projectId: dto.projectId,
        role: ProjectMemberRole.REPORTER,
      });
    } else {
      const existing = await this.memberRepo.findOne({
        where: {
          projectId: dto.projectId,
          employeeId: dto.employeeId,
          role: dto.role,
        },
      });
      if (existing) return existing;
    }
    const member = await this.memberRepo.save({
      projectId: dto.projectId,
      employeeId: dto.employeeId,
      role: dto.role,
    });

    this.rabbitmqAudit.publish({
      service: 'projects',
      action: AuditAction.PROJECT_MEMBER_ADDED,
      actorEmployeeId: dto.actorEmployeeId ?? '',
      resourceId: dto.projectId,
      meta: {
        employeeId: dto.employeeId,
        role: dto.role,
        ...(replacedEmployeeId ? { replacedEmployeeId } : {}),
      },
    });

    return member;
  }

  async removeProjectMember(dto: RemoveProjectMemberDto): Promise<boolean> {
    const member = await this.memberRepo.findOne({ where: { id: dto.id } });
    const result = await this.memberRepo.delete({ id: dto.id });

    if ((result.affected ?? 0) > 0 && member) {
      this.rabbitmqAudit.publish({
        service: 'projects',
        action: AuditAction.PROJECT_MEMBER_REMOVED,
        actorEmployeeId: dto.actorEmployeeId ?? '',
        resourceId: member.projectId,
        meta: { employeeId: member.employeeId, role: member.role },
      });
    }

    return (result.affected ?? 0) > 0;
  }

  async addProjectFile(dto: AddProjectFileDto) {
    const doc = new this.fileModel({
      projectId: dto.projectId,
      url: dto.url,
      name: dto.name,
      mimeType: dto.mimeType || undefined,
      size: dto.size || undefined,
    });
    const saved = await doc.save();
    const obj = saved.toObject();

    this.rabbitmqAudit.publish({
      service: 'projects',
      action: AuditAction.PROJECT_FILE_ADDED,
      actorEmployeeId: dto.actorEmployeeId ?? '',
      resourceId: dto.projectId,
      meta: { name: dto.name, url: dto.url },
    });

    return obj;
  }

  async removeProjectFile(dto: RemoveProjectFileDto): Promise<boolean> {
    const file = await this.fileModel.findById(dto.id).exec();
    const deleted = await this.fileModel.findByIdAndDelete(dto.id).exec();
    if (!deleted) throw new RpcException('File not found');

    if (file) {
      const fileObj = file.toObject() as { name?: string; url?: string; projectId?: string };
      this.rabbitmqAudit.publish({
        service: 'projects',
        action: AuditAction.PROJECT_FILE_REMOVED,
        actorEmployeeId: dto.actorEmployeeId ?? '',
        resourceId: fileObj.projectId ?? '',
        meta: { name: fileObj.name ?? '', url: fileObj.url ?? '' },
      });
    }

    return true;
  }

  async getProjectFiles(projectId: string) {
    const docs = await this.fileModel
      .find({ projectId })
      .sort({ createdAt: 1 })
      .exec();
    return docs.map((d) => d.toObject());
  }

  async getProjectFilesBatch(projectIds: string[]) {
    const docs = await this.fileModel
      .find({ projectId: { $in: projectIds } })
      .sort({ createdAt: 1 })
      .exec();
    return docs.map((d) => d.toObject());
  }

  async addProjectLink(dto: AddProjectLinkDto) {
    const doc = new this.linkModel({
      projectId: dto.projectId,
      url: dto.url,
      title: dto.title || undefined,
    });
    const saved = await doc.save();
    const obj = saved.toObject();

    this.rabbitmqAudit.publish({
      service: 'projects',
      action: AuditAction.PROJECT_LINK_ADDED,
      actorEmployeeId: dto.actorEmployeeId ?? '',
      resourceId: dto.projectId,
      meta: { url: dto.url, title: dto.title ?? '' },
    });

    return obj;
  }

  async removeProjectLink(dto: RemoveProjectLinkDto): Promise<boolean> {
    const link = await this.linkModel.findById(dto.id).exec();
    const deleted = await this.linkModel.findByIdAndDelete(dto.id).exec();
    if (!deleted) throw new RpcException('Link not found');

    if (link) {
      const linkObj = link.toObject() as { url?: string; title?: string; projectId?: string };
      this.rabbitmqAudit.publish({
        service: 'projects',
        action: AuditAction.PROJECT_LINK_REMOVED,
        actorEmployeeId: dto.actorEmployeeId ?? '',
        resourceId: linkObj.projectId ?? '',
        meta: { url: linkObj.url ?? '', title: linkObj.title ?? '' },
      });
    }

    return true;
  }

  async getProjectLinks(projectId: string) {
    const docs = await this.linkModel
      .find({ projectId })
      .sort({ createdAt: 1 })
      .exec();
    return docs.map((d) => d.toObject());
  }

  async getProjectLinksBatch(projectIds: string[]) {
    const docs = await this.linkModel
      .find({ projectId: { $in: projectIds } })
      .sort({ createdAt: 1 })
      .exec();
    return docs.map((d) => d.toObject());
  }
}
