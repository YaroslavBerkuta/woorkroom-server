import { Field, InputType } from '@nestjs/graphql';
import { CreateUserDto } from 'shared';

@InputType()
export class CreateUserInput implements CreateUserDto {
  @Field(() => String)
  email: string;
  @Field(() => String)
  password: string;
  @Field(() => String)
  phoneNumber: string;
}
