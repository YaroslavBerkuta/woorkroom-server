import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanyModel } from '../models';
import { ICompany } from 'shared';
import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { AccessCompanyGuard, GqlSessionAuthGuard } from '../../guards';
import * as grpc from 'woorkroom/grpc';
import { CurrentCompanyId, CurrentSessionId, CurrentUserId } from '../../decorators';

@Resolver(() => CompanyModel)
export class CompanysResolver {
  constructor(
    @Inject(grpc.GrpcCompanysService.name)
    private readonly grpcCompanysService: grpc.IGrpcCompanyService,
    @Inject(grpc.GrpcAuthService.name)
    private readonly grpcAuthService: grpc.IGrpcAuthService,
  ) {}

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Query(() => CompanyModel)
  async company(@CurrentCompanyId() companyId: string) {
    const company = await this.grpcCompanysService.getCompanyById(companyId);
    return company ? this.wrapData(company) : null;
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => Boolean)
  async selectMyCompany(
    @Args('companyId') companyId: string,
    @CurrentSessionId() sessionId: string,
  ) {
    const company = await this.grpcCompanysService.getCompanyById(companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    await this.grpcAuthService.selectCompany({ sessionId, companyId });
    return true;
  }

  @UseGuards(GqlSessionAuthGuard)
  @Query(() => [CompanyModel])
  async myCompanys(@CurrentUserId() userId: string) {
    const companys = await this.grpcCompanysService.getMyCompanys(userId);
    return companys.map((company) => this.wrapData(company));
  }

  public wrapData(data: ICompany): CompanyModel {
    return {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }
}
