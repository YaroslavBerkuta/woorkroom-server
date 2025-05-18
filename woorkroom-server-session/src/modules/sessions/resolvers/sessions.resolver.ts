import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Sessions, Users } from '../model';
import { SessionService } from '../services';
import { RegisterDto, SendVerificationCode } from '../dto';
import { Inject } from '@nestjs/common';
import { SESSION_SERVICES } from '../types';

@Resolver(() => Sessions)
export class SessionsResolver {
  constructor(
    @Inject(SESSION_SERVICES) private readonly sessionService: SessionService,
  ) {}

  @Query(() => Sessions)
  async session(@Args('id') id: number): Promise<Sessions> {
    const session = await this.sessionService.getById(id);

    if (!session) throw new Error('Session not found!');

    return session;
  }

  @Mutation(() => Boolean)
  async register(@Args('dto') dto: RegisterDto): Promise<boolean> {
    const res = await this.sessionService.register(dto);

    if (!res) throw new Error('User not created!');

    return !!res;
  }

  @Mutation(() => Boolean)
  async sendVerificationCode(
    @Args('dto') dto: SendVerificationCode,
  ): Promise<boolean> {
    try {
      await this.sessionService.sendVerificationCode(dto.phoneNumber);
      return true;
    } catch (error) {
      throw new Error('Failed to send verification code');
    }
  }

  @ResolveField(() => Users)
  user(@Parent() session: Sessions): Users {
    return { id: session.userId };
  }
}
