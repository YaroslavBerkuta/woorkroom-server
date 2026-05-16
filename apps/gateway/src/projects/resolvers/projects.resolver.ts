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
import { ProjectMemberModel, ProjectModel } from '../models';
import { IProject, IProjectMember, ProjectPriority } from 'shared';

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

  private wrapMember(data: IProjectMember): ProjectMemberModel {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}
