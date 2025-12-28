import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { ICompany } from 'shared';

@ObjectType()
export class CompanyModel implements ICompany {
  @Field(() => ID)
  id: string;
  @Field(() => String)
  name: string;
  @Field(() => String, { nullable: true })
  service?: string;
  @Field(() => String, { nullable: true })
  describes?: string;
  @Field(() => String, { nullable: true })
  logo?: string;
  @Field(() => String, { nullable: true })
  direction?: string;
  @Field(() => Number)
  peopleCountStart: number;
  @Field(() => Number)
  peopleCountEnd: number;
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
