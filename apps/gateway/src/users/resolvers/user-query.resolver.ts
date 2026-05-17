import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserModel } from '../models/user.model';
import * as grpc from 'woorkroom/grpc';
import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { IUser } from 'shared';
import { SessionModel } from '../../auth';
import { CurrentUserId } from '../../decorators';
import { GqlSessionAuthGuard } from '../../guards';

@Resolver(() => UserModel)
export class UserQueryResolver {
  constructor(
    @Inject(grpc.GrpcUsersService.name)
    private readonly grpcUsersService: grpc.IGrpcUsersService,
    @Inject(grpc.GrpcAuthService.name)
    private readonly grpcAuthService: grpc.IGrpcAuthService,
  ) {}

  @UseGuards(GqlSessionAuthGuard)
  @Query(() => UserModel, { nullable: true })
  async me(@CurrentUserId() userId: string) {
    const user = await this.grpcUsersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.wrapData(user);
  }

  @ResolveField(() => [SessionModel])
  async sessions(@Parent() parent: UserModel) {
    const sessions = await this.grpcAuthService.getUserSessions({
      userId: parent.id,
    });
    return sessions || [];
  }

  public wrapData(data: IUser): UserModel {
    return {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }
}
