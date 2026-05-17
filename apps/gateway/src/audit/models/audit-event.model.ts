import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuditEventModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  service: string;

  @Field(() => String)
  action: string;

  @Field(() => String)
  actorEmployeeId: string;

  @Field(() => String)
  resourceId: string;

  @Field(() => String)
  meta: string;

  @Field(() => String)
  createdAt: string;
}
