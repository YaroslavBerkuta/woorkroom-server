import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserModel } from '../models/user.model';
import * as rabbitmq from 'woorkroom/rabbitmq';
import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { IUser } from 'shared';
import { SessionModel } from '../../auth';
import { CurrentUserId } from '../../decorators';
import { GqlSessionAuthGuard } from '../../guards';

@Resolver(() => UserModel)
export class UserQueryResolver {
  constructor(
    @Inject(rabbitmq.RabbitmqUsersService.name)
    private readonly rabbitmqUsersService: rabbitmq.IRabbitmqUsersService,
    @Inject(rabbitmq.RabbitmqAuthService.name)
    private readonly rabbitmqAuthService: rabbitmq.IRabbitmqAuthService,
  ) {}

  @UseGuards(GqlSessionAuthGuard)
  @Query(() => UserModel, { nullable: true })
  async me(@CurrentUserId() userId: string) {
    const user = await this.rabbitmqUsersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.wrapData(user);
  }

  @ResolveField(() => [SessionModel])
  async sessions(@Parent() parent: UserModel) {
    const sessions = await this.rabbitmqAuthService.getUserSessions({
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
