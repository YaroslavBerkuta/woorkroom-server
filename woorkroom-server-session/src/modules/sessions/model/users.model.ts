import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Users {
  @Field(() => Int)
  @Directive('@external')
  id: number;
}
