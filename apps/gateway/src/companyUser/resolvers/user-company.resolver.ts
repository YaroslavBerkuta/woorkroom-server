import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CompanyModel } from '../../companys';
import { UserModel } from '../../users';
import { Inject } from '@nestjs/common';
import { CompanysResolver } from '../../companys/resolvers';
import * as rabbitmq from 'woorkroom/rabbitmq';

@Resolver(() => UserModel)
export class UserCompanyResolver {
  constructor(
    @Inject(rabbitmq.RabbitmqCompanyService.name)
    private readonly rabbitmqCompanysService: rabbitmq.IRabbitmqCompanyService,
    private readonly companysResolver: CompanysResolver,
  ) {}

  @ResolveField(() => [CompanyModel])
  async myCompanys(@Parent() parent: UserModel) {
    const companys = await this.rabbitmqCompanysService.getMyCompanys(
      parent.id,
    );
    return (
      companys.map((company) => this.companysResolver.wrapData(company)) || []
    );
  }
}
