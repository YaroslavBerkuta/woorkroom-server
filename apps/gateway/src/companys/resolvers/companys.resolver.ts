import {
  Args,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { CompanyModel, EmployeeModel } from '../models';
import { ICompany, IEmployee, UpdateCompanyDto, UserRole } from 'shared';
import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { AccessCompanyGuard, GqlSessionAuthGuard } from '../../guards';
import * as grpc from 'woorkroom/grpc';
import {
  CurrentCompanyId,
  CurrentSessionId,
  CurrentUserId,
} from '../../decorators';
import { CreateCompanyInput } from '../../auth/inputs';

@InputType()
export class UpdateCompanyInput implements Omit<UpdateCompanyDto, 'id'> {
  @Field(() => String, { nullable: true })
  name?: string;
  @Field(() => String, { nullable: true })
  service?: string;
  @Field(() => String, { nullable: true })
  describes?: string;
  @Field(() => String, { nullable: true })
  logo?: string;
  @Field(() => String, { nullable: true })
  direction?: string;
  @Field(() => Int, { nullable: true })
  peopleCountStart?: number;
  @Field(() => Int, { nullable: true })
  peopleCountEnd?: number;
}

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

  @UseGuards(GqlSessionAuthGuard)
  @Mutation(() => CompanyModel)
  async createCompany(
    @CurrentUserId() userId: string,
    @Args('input', { type: () => CreateCompanyInput })
    input: CreateCompanyInput,
  ) {
    const company = await this.grpcCompanysService.createCompany(input);
    await this.grpcCompanysService.createEmployee({
      companyId: company.id,
      userId,
      role: UserRole.OWNER,
    });
    return this.wrapData(company);
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => CompanyModel)
  async updateCompany(
    @CurrentCompanyId() companyId: string,
    @Args('input', { type: () => UpdateCompanyInput })
    input: UpdateCompanyInput,
  ) {
    const updated = await this.grpcCompanysService.updateCompany({
      id: companyId,
      ...input,
    });
    return this.wrapData(updated);
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
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}
