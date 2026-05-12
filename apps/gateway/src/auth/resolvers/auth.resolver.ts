import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LoginInput, LogoutInput, RegisterInput } from '../inputs';
import { Inject, UseGuards } from '@nestjs/common';
import { SessionModel } from '../models';
import * as rabbitmq from 'woorkroom/rabbitmq';
import { extractSessionId, GqlSessionAuthGuard } from '../../guards';
import { CurrentUserId } from '../../decorators';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(rabbitmq.RabbitmqAuthService.name)
    private readonly authService: rabbitmq.IRabbitmqAuthService,
  ) {}

  @Mutation(() => SessionModel)
  async login(@Args('input') input: LoginInput, @Context() ctx: any) {
    const session = await this.authService.loginUser(input);

    const cookieName = 'sid';

    ctx.res.cookie(cookieName, session.sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: session.expiresIn * 1000,
      path: '/',
    });

    return session;
  }

  @UseGuards(GqlSessionAuthGuard)
  @Mutation(() => Boolean)
  async logout(@CurrentUserId() userId: string, @Context() ctx: any) {
    const sid = extractSessionId(ctx.req);
    if (sid)
      await this.authService.logoutUser({
        sessionId: sid,
        userId,
      });

    if (ctx?.req?.session) {
      delete ctx.req.session;
    }

    ctx.res.clearCookie('sid', { path: '/' });

    return true;
  }

  @Mutation(() => Boolean)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.registerUser(input);
  }
}
