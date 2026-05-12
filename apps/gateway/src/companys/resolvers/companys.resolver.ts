import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanyModel } from '../models';
import { ICompany } from 'shared';
import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { AccessCompanyGuard, GqlSessionAuthGuard } from '../../guards';
import * as rabbitmq from 'woorkroom/rabbitmq';
import { CurrentCompanyId, CurrentUserId } from '../../decorators';

@Resolver(() => CompanyModel)
export class CompanysResolver {
  constructor(
    @Inject(rabbitmq.RabbitmqCompanyService.name)
    private readonly rabbitmqCompanysService: rabbitmq.IRabbitmqCompanyService,
  ) {}

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Query(() => CompanyModel)
  async company(@CurrentCompanyId() companyId: string) {
    const company =
      await this.rabbitmqCompanysService.getCompanyById(companyId);
    return company ? this.wrapData(company) : null;
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => Boolean)
  async selectMyCompany(@Args('companyId') companyId: string) {
    const company =
      await this.rabbitmqCompanysService.getCompanyById(companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return true;
  }

  @UseGuards(GqlSessionAuthGuard)
  @Query(() => [CompanyModel])
  async myCompanys(@CurrentUserId() userId: string) {
    const companys = await this.rabbitmqCompanysService.getMyCompanys(userId);
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
