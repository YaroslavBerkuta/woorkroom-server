import {
  Args,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import * as grpc from 'woorkroom/grpc';
import { AccessCompanyGuard, GqlSessionAuthGuard } from '../../guards';
import { CurrentCompanyId, CurrentUserId } from '../../decorators';
import { ProjectFileModel, ProjectLinkModel, ProjectMemberModel, ProjectModel } from '../models';
import { IProject, IProjectFile, IProjectLink, IProjectMember, ProjectPriority, ProjectStatus, UpdateProjectDto } from 'shared';

@InputType()
export class UpdateProjectInput implements Omit<UpdateProjectDto, 'id'> {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  starts?: string;

  @Field(() => String, { nullable: true })
  deadline?: string;

  @Field(() => ProjectPriority, { nullable: true })
  priority?: ProjectPriority;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  image?: string;
}

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  starts?: string;

  @Field(() => String, { nullable: true })
  deadline?: string;

  @Field(() => ProjectPriority, { nullable: true })
  priority?: ProjectPriority;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  image?: string;

  @Field(() => String, { nullable: true })
  reporterId?: string;

  @Field(() => [String], { nullable: true })
  assigneeIds?: string[];
}

@Resolver(() => ProjectModel)
export class ProjectsResolver {
  constructor(
    @Inject(grpc.GrpcProjectsService.name)
    private readonly grpcProjectsService: grpc.IGrpcProjectsService,
    @Inject(grpc.GrpcCompanysService.name)
    private readonly grpcCompanysService: grpc.IGrpcCompanyService,
  ) {}

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => ProjectModel)
  async createProject(
    @Args('input') input: CreateProjectInput,
    @CurrentCompanyId() companyId: string,
    @CurrentUserId() userId: string,
  ): Promise<ProjectModel> {
    const profile = await this.grpcCompanysService.getMyCompanyProfile(
      companyId,
      userId,
    );
    if (!profile) throw new Error('Employee profile not found');

    const project = await this.grpcProjectsService.createProject({
      ...input,
      companyId,
      creatorEmployeeId: profile.id,
    });
    return this.wrapProject(project);
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Query(() => [ProjectModel])
  async myProjects(
    @CurrentCompanyId() companyId: string,
    @CurrentUserId() userId: string,
  ): Promise<ProjectModel[]> {
    const profile = await this.grpcCompanysService.getMyCompanyProfile(
      companyId,
      userId,
    );
    if (!profile) return [];

    const projects = await this.grpcProjectsService.getMyProjects(
      companyId,
      profile.id,
    );
    return projects.map((p) => this.wrapProject(p));
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => ProjectModel)
  async updateProject(
    @Args('projectId', { type: () => String }) projectId: string,
    @Args('input') input: UpdateProjectInput,
  ): Promise<ProjectModel> {
    const project = await this.grpcProjectsService.updateProject({ id: projectId, ...input });
    return this.wrapProject(project);
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => ProjectModel)
  async updateProjectStatus(
    @Args('projectId', { type: () => String }) projectId: string,
    @Args('status', { type: () => ProjectStatus }) status: ProjectStatus,
  ): Promise<ProjectModel> {
    const project = await this.grpcProjectsService.updateProjectStatus(projectId, status);
    return this.wrapProject(project);
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Query(() => [ProjectMemberModel])
  async projectMembers(
    @Args('projectId', { type: () => String }) projectId: string,
  ): Promise<ProjectMemberModel[]> {
    const members =
      await this.grpcProjectsService.getProjectMembers(projectId);
    return members.map((m) => this.wrapMember(m));
  }

  private wrapProject(data: IProject): ProjectModel {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => ProjectFileModel)
  async addProjectFile(
    @Args('projectId', { type: () => String }) projectId: string,
    @Args('url', { type: () => String }) url: string,
    @Args('name', { type: () => String }) name: string,
    @Args('mimeType', { type: () => String, nullable: true }) mimeType?: string,
    @Args('size', { type: () => Number, nullable: true }) size?: number,
  ): Promise<ProjectFileModel> {
    const file = await this.grpcProjectsService.addProjectFile({ projectId, url, name, mimeType, size });
    return this.wrapFile(file);
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => Boolean)
  async removeProjectFile(
    @Args('fileId', { type: () => String }) fileId: string,
  ): Promise<boolean> {
    return this.grpcProjectsService.removeProjectFile(fileId);
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Query(() => [ProjectFileModel])
  async projectFiles(
    @Args('projectId', { type: () => String }) projectId: string,
  ): Promise<ProjectFileModel[]> {
    const files = await this.grpcProjectsService.getProjectFiles(projectId);
    return files.map((f) => this.wrapFile(f));
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => ProjectLinkModel)
  async addProjectLink(
    @Args('projectId', { type: () => String }) projectId: string,
    @Args('url', { type: () => String }) url: string,
    @Args('title', { type: () => String, nullable: true }) title?: string,
  ): Promise<ProjectLinkModel> {
    const link = await this.grpcProjectsService.addProjectLink({ projectId, url, title });
    return this.wrapLink(link);
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => Boolean)
  async removeProjectLink(
    @Args('linkId', { type: () => String }) linkId: string,
  ): Promise<boolean> {
    return this.grpcProjectsService.removeProjectLink(linkId);
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Query(() => [ProjectLinkModel])
  async projectLinks(
    @Args('projectId', { type: () => String }) projectId: string,
  ): Promise<ProjectLinkModel[]> {
    const links = await this.grpcProjectsService.getProjectLinks(projectId);
    return links.map((l) => this.wrapLink(l));
  }

  private wrapMember(data: IProjectMember): ProjectMemberModel {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  private wrapFile(data: IProjectFile): ProjectFileModel {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  private wrapLink(data: IProjectLink): ProjectLinkModel {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}
