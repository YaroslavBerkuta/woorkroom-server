import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { IEmployee, UserRole, UserStatus } from 'shared';

@ObjectType()
export class EmployeeModel implements IEmployee {
  @Field(() => ID)
  id: string;
  @Field(() => ID)
  companyId: string;
  @Field(() => ID)
  userId: string;
  @Field(() => String, { nullable: true })
  name?: string;
  @Field(() => String, { nullable: true })
  lastName?: string;
  @Field(() => UserRole)
  role: UserRole;
  @Field(() => UserStatus)
  status: UserStatus;
  @Field(() => String, { nullable: true })
  avatar?: string;
  @Field(() => String, { nullable: true })
  position?: string;
  @Field(() => String, { nullable: true })
  location?: string;
  @Field(() => GraphQLISODateTime, { nullable: true })
  birthday?: Date;
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
