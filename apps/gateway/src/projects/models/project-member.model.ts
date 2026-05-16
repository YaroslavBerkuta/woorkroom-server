import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { IProjectMember, ProjectMemberRole } from 'shared';

@ObjectType()
export class ProjectMemberModel implements Omit<IProjectMember, 'createdAt' | 'updatedAt'> {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  projectId: string;

  @Field(() => ID)
  employeeId: string;

  @Field(() => ProjectMemberRole)
  role: ProjectMemberRole;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
