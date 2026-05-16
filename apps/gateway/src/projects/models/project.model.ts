import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { IProject, ProjectPriority } from 'shared';

@ObjectType()
export class ProjectModel implements Omit<IProject, 'createdAt' | 'updatedAt'> {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  companyId: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  starts?: string;

  @Field(() => String, { nullable: true })
  deadline?: string;

  @Field(() => ProjectPriority, { nullable: true })
  priority?: ProjectPriority;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  image?: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
