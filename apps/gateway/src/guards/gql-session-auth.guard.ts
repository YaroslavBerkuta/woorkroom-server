import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as rabbitmq from 'woorkroom/rabbitmq';
import { Request } from 'express';

@Injectable()
export class GqlSessionAuthGuard implements CanActivate {
  constructor(
    @Inject(rabbitmq.RabbitmqAuthService.name)
    private readonly authService: rabbitmq.IRabbitmqAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const sid = extractSessionId(req);
    if (!sid) throw new UnauthorizedException('No session');

    const session = await this.authService.getSession({ sessionId: sid });
    if (!session) throw new UnauthorizedException();

    req.session = session;

    return true;
  }
}

export const extractSessionId = (req: Request): string | null => {
  const auth = req.headers['authorization'];
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
    return auth.slice('Bearer '.length).trim();
  }

  if (req.cookies?.sid) return req.cookies.sid;

  return null;
};
