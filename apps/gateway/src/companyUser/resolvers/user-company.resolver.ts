import { Args, InputType, Field, Mutation, ResolveField, Resolver, GraphQLISODateTime } from '@nestjs/graphql';
import { CompanyModel, EmployeeModel } from '../../companys';
import { UserModel } from '../../users';
import { Inject, UseGuards } from '@nestjs/common';
import { CompanysResolver } from '../../companys/resolvers';
import * as grpc from 'woorkroom/grpc';
import { AccessCompanyGuard, GqlSessionAuthGuard } from '../../guards';
import { CurrentCompanyId, CurrentSessionId, CurrentUserId } from '../../decorators';
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

@Resolver(() => UserModel)
export class UserCompanyResolver {
  constructor(
    @Inject(grpc.GrpcCompanysService.name)
    private readonly grpcCompanysService: grpc.IGrpcCompanyService,
    private readonly companysResolver: CompanysResolver,
  ) {}

  @UseGuards(GqlSessionAuthGuard)
  @ResolveField(() => CompanyModel, { nullable: true })
  async company(@CurrentCompanyId() companyId: string) {
    if (!companyId) return null;

    const company = await this.grpcCompanysService.getCompanyById(companyId);

    if (!company) return null;

    return this.companysResolver.wrapData(company);
  }

  @UseGuards(GqlSessionAuthGuard)
  @ResolveField(() => EmployeeModel, { nullable: true })
  async profile(
    @CurrentCompanyId() companyId: string,
    @CurrentUserId() userId: string,
  ): Promise<EmployeeModel | null> {
    if (!companyId) return null;

    const profile = await this.grpcCompanysService.getMyCompanyProfile(
      companyId,
      userId,
    );

    return profile ? this.wrapData(profile) : null;
  }

  @UseGuards(GqlSessionAuthGuard, AccessCompanyGuard)
  @Mutation(() => EmployeeModel)
  async updateMyProfile(
    @Args('input') input: UpdateProfileInput,
    @CurrentCompanyId() companyId: string,
    @CurrentUserId() userId: string,
  ): Promise<EmployeeModel> {
    const profile = await this.grpcCompanysService.getMyCompanyProfile(companyId, userId);
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
      createdAt: new Date(data.createdAt) || new Date(),
      updatedAt: new Date(data.updatedAt) || new Date(),
    };
  }
}
