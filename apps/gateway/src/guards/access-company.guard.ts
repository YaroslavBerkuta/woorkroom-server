import {
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as rabbitmq from 'woorkroom/rabbitmq';

@Injectable()
export class AccessCompanyGuard implements CanActivate {
  constructor(
    @Inject(rabbitmq.RabbitmqCompanyService.name)
    private readonly companyService: rabbitmq.IRabbitmqCompanyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const args = ctx.getArgs();

    const userId = req.session.userId;
    const companyId = args.companyId || req.session.companyId;

    if (!userId) return false;

    if (!companyId) {
      throw new ForbiddenException('CompanyId is required');
    }

    const companys = await this.companyService.getMyCompanys(userId);

    return companys.some((company) => company.id === companyId);
  }
}
