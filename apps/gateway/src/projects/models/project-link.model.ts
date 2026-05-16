import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { IProjectLink } from 'shared';

@ObjectType()
export class ProjectLinkModel implements Omit<IProjectLink, 'createdAt' | 'updatedAt'> {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  projectId: string;

  @Field(() => String)
  url: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
