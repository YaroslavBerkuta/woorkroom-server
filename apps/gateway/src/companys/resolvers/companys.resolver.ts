import { Query, Resolver } from '@nestjs/graphql';
import { CompanyModel } from '../models';
import { ICompany } from 'shared';

@Resolver(() => CompanyModel)
export class CompanysResolver {
  @Query(() => CompanyModel)
  async company() {
    return null;
  }

  public wrapData(data: ICompany): CompanyModel {
    return {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }
}
