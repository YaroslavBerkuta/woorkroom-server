import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Sessions } from '../model';
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
  async session(): Promise<boolean> {
    return true;
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
}
