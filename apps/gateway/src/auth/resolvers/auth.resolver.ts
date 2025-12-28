import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginInput, LogoutInput, RegisterInput } from '../inputs';
import { Inject } from '@nestjs/common';
import { SessionModel } from '../models';
import * as rabbitmq from 'woorkroom/rabbitmq';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(rabbitmq.RabbitmqAuthService.name)
    private readonly authService: rabbitmq.IRabbitmqAuthService,
  ) {}

  @Mutation(() => SessionModel)
  async login(@Args('input') input: LoginInput) {
    return this.authService.loginUser(input);
  }

  @Mutation(() => Boolean)
  async logout(@Args('input') input: LogoutInput) {
    return this.authService.logoutUser(input);
  }

  @Mutation(() => Boolean)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.registerUser(input);
  }
}
