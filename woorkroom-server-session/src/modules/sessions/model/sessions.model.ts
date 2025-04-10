import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { ISession } from '../types';

@ObjectType()
@Directive('@key(fields: "id")')
export class Sessions implements ISession {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => String)
  ip: string;

  @Field(() => String)
  userAgent: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
