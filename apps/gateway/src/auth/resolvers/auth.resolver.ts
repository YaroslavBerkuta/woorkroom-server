import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterInput } from '../inputs';

@Resolver()
export class AuthResolver {
  constructor() {}

  @Mutation(() => String)
  async login() {}

  @Mutation(() => String)
  async register(@Args('input') input: RegisterInput) {}
}
