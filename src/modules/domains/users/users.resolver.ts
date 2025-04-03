import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Users } from './model';
import { UsersService } from './services/users.service';

@Resolver(() => Users)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [Users])
  async users() {
    return;
  }

  @Mutation(() => Users)
  async createUser(
    @Args('name') name: string,
    @Args('email') email: string,
  ): Promise<Users> {
    return await this.usersService.createUser(name, email);
  }
}
