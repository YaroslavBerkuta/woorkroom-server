import {
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { ISession } from 'shared';
import * as grpc from 'woorkroom/grpc';

interface GqlContext {
  req: Request & { session?: ISession };
}

@Injectable()
export class AccessCompanyGuard implements CanActivate {
  constructor(
    @Inject(grpc.GrpcCompanysService.name)
    private readonly companyService: grpc.IGrpcCompanyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<GqlContext>();
    const args = ctx.getArgs<{ companyId?: string }>();

    const userId = req.session?.userId;
    const companyId = args.companyId || req.session?.companyId;

    if (!userId) return false;

    if (!companyId) {
      throw new ForbiddenException('CompanyId is required');
    }

    const companys = await this.companyService.getMyCompanys(userId);

    return companys.some((company) => company.id === companyId);
  }
}
