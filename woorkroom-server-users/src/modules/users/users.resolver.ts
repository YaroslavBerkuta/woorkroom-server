import { Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { Users } from './model';
import { UsersService } from './services/users.service';

@Resolver(() => Users)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [Users])
  async users() {
    return await this.usersService.getAll();
  }

  @ResolveReference()
  async resolveReference(reference: {
    __typename: string;
    id: number;
  }): Promise<Users> {
    return this.usersService.getById(reference.id);
  }
}
