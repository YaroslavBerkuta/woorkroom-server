import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import * as grpc from 'woorkroom/grpc';
import { AccessCompanyGuard, GqlSessionAuthGuard } from '../../guards';
import { CurrentCompanyId, CurrentUserId } from '../../decorators';
import { ActivityEventModel } from '../models/activity-event.model';

@Resolver(() => ActivityEventModel)
export class ActivityResolver {
  constructor(
    @Inject(grpc.GrpcActivityService.name)
    private readonly grpcActivityService: grpc.IGrpcActivityService,
    @Inject(grpc.GrpcCompanysService.name)
    private readonly grpcCompanysService: grpc.IGrpcCompanyService,
  ) {}

  @UseGuards(GqlSessionAuthGuard)
  @Query(() => [ActivityEventModel])
  async activityFeed(
    @Args('resourceId', { type: () => String }) resourceId: string,
    @Args('types', { type: () => [String], nullable: true }) types?: string[],
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 })
    limit: number = 20,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number = 0,
  ): Promise<ActivityEventModel[]> {
    const result = await this.grpcActivityService.getActivityFeed({
      resourceId,
      types: types ?? [],
      limit,
      offset,
    });
    return result.events as ActivityEventModel[];
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => ActivityEventModel)
  async addComment(
    @Args('resourceId', { type: () => String }) resourceId: string,
    @Args('resourceType', { type: () => String }) resourceType: string,
    @Args('content', { type: () => String }) content: string,
    @CurrentUserId() userId: string,
    @CurrentCompanyId() companyId: string,
  ): Promise<ActivityEventModel> {
    const profile = await this.grpcCompanysService.getMyCompanyProfile(
      companyId,
      userId,
    );
    if (!profile) throw new Error('Employee profile not found');

    return this.grpcActivityService.addComment({
      resourceId,
      resourceType,
      actorEmployeeId: profile.id,
      content,
    }) as Promise<ActivityEventModel>;
  }

  @UseGuards(GqlSessionAuthGuard)
  @Mutation(() => ActivityEventModel)
  async editComment(
    @Args('id', { type: () => String }) id: string,
    @Args('content', { type: () => String }) content: string,
  ): Promise<ActivityEventModel> {
    return this.grpcActivityService.editComment({ id, content }) as Promise<ActivityEventModel>;
  }

  @UseGuards(GqlSessionAuthGuard)
  @Mutation(() => Boolean)
  async deleteComment(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.grpcActivityService.deleteComment(id);
  }
}
