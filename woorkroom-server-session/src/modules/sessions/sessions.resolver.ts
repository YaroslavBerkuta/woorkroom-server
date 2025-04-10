import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Sessions } from './model';
import { SessionService } from './services';
import { RegisterDto } from './dto';

@Resolver(() => Sessions)
export class SessionsResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Query(() => Sessions)
  async session(): Promise<boolean> {
    return true;
  }

  @Mutation(() => Boolean)
  async register(@Args('dto') dto: RegisterDto): Promise<boolean> {
    await this.sessionService.register(dto);
    return true;
  }
}
