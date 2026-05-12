import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const req = gqlCtx.getContext().req;
    return req.session?.userId;
  },
);

export const CurrentCompanyId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const req = gqlCtx.getContext().req;
    return req.session?.companyId;
  },
);
