import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { IUser } from 'shared';

@ObjectType()
export class UserModel implements IUser {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
