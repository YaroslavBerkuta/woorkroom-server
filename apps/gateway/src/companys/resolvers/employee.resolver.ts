import { Query, Resolver } from '@nestjs/graphql';
import { EmployeeModel } from '../models';

@Resolver(() => EmployeeModel)
export class EmployeeResolver {
  @Query(() => EmployeeModel)
  async employee() {
    return null;
  }
}
