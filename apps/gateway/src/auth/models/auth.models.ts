import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import * as shared from 'shared';

@ObjectType()
export class SessionModel implements shared.ISession {
  @Field(() => ID)
  sessionId: string;

  @Field(() => Int)
  expiresIn: number;

  @Field(() => ID)
  userId: string;

  @Field(() => String)
  createdAt: string;
}
