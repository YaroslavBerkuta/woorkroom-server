import { Args, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { Users } from './model';
import { UsersService } from './services/users.service';

@Resolver(() => Users)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Users)
  async users(@Args('id') id: number): Promise<Users> {
    return await this.usersService.getById(id);
  }

  @ResolveReference()
  async resolveReference(reference: {
    __typename: string;
    id: number;
  }): Promise<Users> {
    return this.usersService.getById(reference.id);
  }
}
