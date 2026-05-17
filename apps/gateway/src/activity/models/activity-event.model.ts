import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AttachmentModel {
  @Field(() => String)
  url: string;

  @Field(() => String, { nullable: true })
  thumbnailUrl?: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  mimetype: string;

  @Field(() => Int)
  size: number;
}

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
  action?: string;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => [AttachmentModel])
  attachments: AttachmentModel[];

  @Field(() => String)
  meta: string;

  @Field(() => Boolean)
  isEdited: boolean;

  @Field(() => String, { nullable: true })
  editedAt?: string;

  @Field(() => String)
  createdAt: string;
}
