import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { IProjectFile } from 'shared';

@ObjectType()
export class ProjectFileModel
  implements Omit<IProjectFile, 'createdAt' | 'updatedAt'>
{
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  projectId: string;

  @Field(() => String)
  url: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  mimeType?: string;

  @Field(() => Int, { nullable: true })
  size?: number;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
