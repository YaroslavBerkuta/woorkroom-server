import {
  Args,
  InputType,
  Field,
  Mutation,
  ResolveField,
  Resolver,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { CompanyModel, EmployeeModel } from '@/companys';
import { UserModel } from '@/users';
import { Inject, Injectable, Scope, UseGuards } from '@nestjs/common';
import { CompanysResolver } from '@/companys/resolvers';
import * as grpc from 'woorkroom/grpc';
import { AccessCompanyGuard, GqlSessionAuthGuard } from '@/guards';
import { CurrentCompanyId, CurrentUserId } from '@/decorators';
import { IEmployee } from 'shared';

@InputType()
export class UpdateProfileInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => String, { nullable: true })
  position?: string;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  birthday?: Date;
}

@Injectable({ scope: Scope.REQUEST })
@Resolver(() => UserModel)
export class UserCompanyResolver {
  private _company: CompanyModel | null | undefined = undefined;
  private _profile: EmployeeModel | null | undefined = undefined;

  constructor(
    @Inject(grpc.GrpcCompanysService.name)
    private readonly grpcCompanysService: grpc.IGrpcCompanyService,
    private readonly companysResolver: CompanysResolver,
  ) {}

  @UseGuards(GqlSessionAuthGuard)
  @ResolveField(() => CompanyModel, { nullable: true })
  async company(
    @CurrentCompanyId() companyId: string,
  ): Promise<CompanyModel | null> {
    if (this._company !== undefined) return this._company;
    if (!companyId) return (this._company = null);
    const company = await this.grpcCompanysService.getCompanyById(companyId);
    this._company = company ? this.companysResolver.wrapData(company) : null;
    return this._company;
  }

  @UseGuards(GqlSessionAuthGuard)
  @ResolveField(() => EmployeeModel, { nullable: true })
  async profile(
    @CurrentCompanyId() companyId: string,
    @CurrentUserId() userId: string,
  ): Promise<EmployeeModel | null> {
    if (this._profile !== undefined) return this._profile;
    if (!companyId) return (this._profile = null);
    const profile = await this.grpcCompanysService.getMyCompanyProfile(
      companyId,
      userId,
    );
    this._profile = profile ? this.wrapData(profile) : null;
    return this._profile;
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => EmployeeModel)
  async updateMyProfile(
    @Args('input') input: UpdateProfileInput,
    @CurrentCompanyId() companyId: string,
    @CurrentUserId() userId: string,
  ): Promise<EmployeeModel> {
    const profile = await this.grpcCompanysService.getMyCompanyProfile(
      companyId,
      userId,
    );
    if (!profile) throw new Error('Profile not found');
    const updated = await this.grpcCompanysService.updateEmployee({
      id: profile.id,
      ...input,
    });
    return this.wrapData(updated);
  }

  private wrapData(data: IEmployee): EmployeeModel {
    return {
      ...data,
      birthday: data.birthday ? new Date(data.birthday) : null,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}
