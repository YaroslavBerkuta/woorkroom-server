import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ActivityEventModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  resourceId: string;

  @Field(() => String)
  resourceType: string;

  @Field(() => String)
  type: string;

  @Field(() => String)
  actorEmployeeId: string;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => String)
  meta: string;

  @Field(() => Boolean)
  isEdited: boolean;

  @Field(() => String, { nullable: true })
  editedAt?: string;

  @Field(() => String)
  createdAt: string;
}
