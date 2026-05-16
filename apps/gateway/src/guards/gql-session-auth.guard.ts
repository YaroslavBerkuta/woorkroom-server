import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as grpc from 'woorkroom/grpc';
import { Request } from 'express';
import { ISession } from 'shared';

interface GqlContext {
  req: Request & { session?: ISession };
}

@Injectable()
export class GqlSessionAuthGuard implements CanActivate {
  constructor(
    @Inject(grpc.GrpcAuthService.name)
    private readonly authService: grpc.IGrpcAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<GqlContext>();

    if (req.session) return true;

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

  const cookies = req.cookies as Record<string, string> | undefined;
  if (typeof cookies?.sid === 'string') return cookies.sid;

  return null;
};
