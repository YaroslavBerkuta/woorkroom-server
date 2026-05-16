import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

interface GqlRequest extends Request {
  session?: Record<string, string>;
}

interface GqlContext {
  req: GqlRequest;
}

export const CurrentUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const { req } = gqlCtx.getContext<GqlContext>();
    return req.session?.userId;
  },
);

export const CurrentCompanyId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const { req } = gqlCtx.getContext<GqlContext>();
    return req.session?.companyId;
  },
);

export const CurrentSessionId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const { req } = gqlCtx.getContext<GqlContext>();
    return req.session?.sessionId;
  },
);
