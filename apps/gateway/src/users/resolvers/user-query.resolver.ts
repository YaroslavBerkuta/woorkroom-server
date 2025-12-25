import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '../models/user.model';
import * as rabbitmq from 'woorkroom/rabbitmq';
import { Inject, NotFoundException } from '@nestjs/common';
import { IUser } from 'shared';

@Resolver(() => UserModel)
export class UserQueryResolver {
  constructor(
    @Inject(rabbitmq.RabbitmqUsersService.name)
    private readonly rabbitmqUsersService: rabbitmq.IRabbitmqUsersServiceInterface,
  ) {}

  @Query(() => UserModel, { nullable: true })
  async user(@Args('id') id: string) {
    const user = await this.rabbitmqUsersService.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.wrapData(user);
  }

  public wrapData(data: IUser): UserModel {
    return {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }
}
