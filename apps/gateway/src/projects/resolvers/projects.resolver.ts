import {
  Args,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import * as grpc from 'woorkroom/grpc';
import { AccessCompanyGuard, GqlSessionAuthGuard } from '@/guards';
import { CurrentCompanyId, CurrentUserId } from '@/decorators';
import {
  ProjectFileModel,
  ProjectLinkModel,
  ProjectMemberModel,
  ProjectModel,
} from '@/projects/models';
import {
  IProject,
  IProjectFile,
  IProjectLink,
  IProjectMember,
  ProjectMemberRole,
  ProjectPriority,
  ProjectStatus,
  UpdateProjectDto,
} from 'shared';
import { ProjectDataloaderService } from '@/projects/dataloader/project-dataloader.service';

@InputType()
export class ProjectFilterInput {
  @Field(() => String, { nullable: true }) name?: string;
  @Field(() => String, { nullable: true }) slug?: string;
  @Field(() => [ProjectPriority], { nullable: true })
  priority?: ProjectPriority[];
  @Field(() => [ProjectStatus], { nullable: true }) status?: ProjectStatus[];
  @Field(() => [ID], { nullable: true }) reporterIds?: string[];
  @Field(() => [ID], { nullable: true }) assigneeIds?: string[];
  @Field(() => String, { nullable: true }) startsFrom?: string;
  @Field(() => String, { nullable: true }) startsTo?: string;
  @Field(() => String, { nullable: true }) deadlineFrom?: string;
  @Field(() => String, { nullable: true }) deadlineTo?: string;
}

@ObjectType()
export class PageInfoModel {
  @Field(() => Boolean) hasNextPage: boolean;
  @Field(() => String, { nullable: true }) endCursor?: string;
}

@ObjectType()
export class ProjectEdgeModel {
  @Field(() => ProjectModel) node: ProjectModel;
  @Field(() => String) cursor: string;
}

@ObjectType()
export class ProjectsConnectionModel {
  @Field(() => [ProjectEdgeModel]) edges: ProjectEdgeModel[];
  @Field(() => PageInfoModel) pageInfo: PageInfoModel;
  @Field(() => Int) totalCount: number;
}

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
    private readonly projectDataloader: ProjectDataloaderService,
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
  @Query(() => ProjectModel)
  async getProject(
    @Args('projectId', { type: () => String }) projectId: string,
  ): Promise<ProjectModel> {
    const project = await this.grpcProjectsService.getProject(projectId);
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
  @Query(() => ProjectsConnectionModel)
  async myProjectsPaginated(
    @CurrentCompanyId() companyId: string,
    @CurrentUserId() userId: string,
    @Args('first', { type: () => Int, nullable: true, defaultValue: 20 })
    first: number,
    @Args('after', { type: () => String, nullable: true }) after?: string,
    @Args('filter', { type: () => ProjectFilterInput, nullable: true })
    filter?: ProjectFilterInput,
  ): Promise<ProjectsConnectionModel> {
    const profile = await this.grpcCompanysService.getMyCompanyProfile(
      companyId,
      userId,
    );
    if (!profile) {
      return {
        edges: [],
        pageInfo: { hasNextPage: false, endCursor: undefined },
        totalCount: 0,
      };
    }

    const result = await this.grpcProjectsService.getMyProjectsPaginated({
      companyId,
      employeeId: profile.id,
      first,
      after,
      filter,
    });

    return {
      edges: result.edges.map((e) => ({
        node: this.wrapProject(e.node),
        cursor: e.cursor,
      })),
      pageInfo: result.pageInfo,
      totalCount: result.totalCount,
    };
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Query(() => [ProjectModel])
  async companyProjects(
    @CurrentCompanyId() companyId: string,
  ): Promise<ProjectModel[]> {
    const projects =
      await this.grpcProjectsService.getCompanyProjects(companyId);
    return projects.map((p) => this.wrapProject(p));
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => ProjectModel)
  async updateProject(
    @Args('projectId', { type: () => String }) projectId: string,
    @Args('input') input: UpdateProjectInput,
  ): Promise<ProjectModel> {
    const project = await this.grpcProjectsService.updateProject({
      id: projectId,
      ...input,
    });
    return this.wrapProject(project);
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => ProjectModel)
  async updateProjectStatus(
    @Args('projectId', { type: () => String }) projectId: string,
    @Args('status', { type: () => ProjectStatus }) status: ProjectStatus,
  ): Promise<ProjectModel> {
    const project = await this.grpcProjectsService.updateProjectStatus(
      projectId,
      status,
    );
    return this.wrapProject(project);
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Query(() => [ProjectMemberModel])
  async projectMembers(
    @Args('projectId', { type: () => String }) projectId: string,
  ): Promise<ProjectMemberModel[]> {
    const members = await this.grpcProjectsService.getProjectMembers(projectId);
    return members.map((m) => this.wrapMember(m));
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => ProjectMemberModel)
  async addProjectMember(
    @Args('projectId', { type: () => String }) projectId: string,
    @Args('employeeId', { type: () => String }) employeeId: string,
    @Args('role', { type: () => ProjectMemberRole }) role: ProjectMemberRole,
  ): Promise<ProjectMemberModel> {
    const member = await this.grpcProjectsService.addProjectMember({
      projectId,
      employeeId,
      role,
    });
    return this.wrapMember(member);
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => Boolean)
  async removeProjectMember(
    @Args('memberId', { type: () => String }) memberId: string,
  ): Promise<boolean> {
    return this.grpcProjectsService.removeProjectMember(memberId);
  }

  @ResolveField('files', () => [ProjectFileModel])
  async resolveFiles(
    @Parent() project: ProjectModel,
  ): Promise<ProjectFileModel[]> {
    const files = await this.projectDataloader.filesLoader.load(project.id);
    return files.map((f) => this.wrapFile(f));
  }

  @ResolveField('links', () => [ProjectLinkModel])
  async resolveLinks(
    @Parent() project: ProjectModel,
  ): Promise<ProjectLinkModel[]> {
    const links = await this.projectDataloader.linksLoader.load(project.id);
    return links.map((l) => this.wrapLink(l));
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
    const file = await this.grpcProjectsService.addProjectFile({
      projectId,
      url,
      name,
      mimeType,
      size,
    });
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
    const link = await this.grpcProjectsService.addProjectLink({
      projectId,
      url,
      title,
    });
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
