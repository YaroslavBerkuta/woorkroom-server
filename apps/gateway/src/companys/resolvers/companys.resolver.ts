import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanyModel, EmployeeModel } from '../models';
import { ICompany, IEmployee } from 'shared';
import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { AccessCompanyGuard, GqlSessionAuthGuard } from '../../guards';
import * as grpc from 'woorkroom/grpc';
import {
  CurrentCompanyId,
  CurrentSessionId,
  CurrentUserId,
} from '../../decorators';

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

  @UseGuards(GqlSessionAuthGuard)
  @Mutation(() => Boolean)
  async selectMyCompany(
    @Args('companyId', { type: () => ID }) companyId: string,
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

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Query(() => [EmployeeModel])
  async companyMembers(@CurrentCompanyId() companyId: string) {
    const members = await this.grpcCompanysService.getCompanyMembers(companyId);
    return members.map((m) => this.wrapEmployee(m));
  }

  public wrapData(data: ICompany): CompanyModel {
    return {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }

  private wrapEmployee(data: IEmployee): EmployeeModel {
    return {
      ...data,
      birthday: data.birthday ? new Date(data.birthday) : null,
      createdAt: new Date(data.createdAt) || new Date(),
      updatedAt: new Date(data.updatedAt) || new Date(),
    };
  }
}
