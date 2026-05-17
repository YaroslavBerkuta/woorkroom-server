import { Field, ID, InputType } from '@nestjs/graphql';
import { ILogin, ILogout } from 'shared';
import { CreateUserInput } from '../../users';

@InputType()
export class CreateCompanyInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  service?: string;

  @Field(() => String, { nullable: true })
  describes?: string;

  @Field(() => String, { nullable: true })
  logo?: string;

  @Field(() => String, { nullable: true })
  direction?: string;

  @Field(() => Number)
  peopleCountStart: number;

  @Field(() => Number)
  peopleCountEnd: number;
}

@InputType()
export class RegisterInput {
  @Field(() => CreateUserInput)
  user: CreateUserInput;

  @Field(() => String)
  code: string;

  @Field(() => CreateCompanyInput)
  company: CreateCompanyInput;
}

@InputType()
export class LoginInput implements ILogin {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

@InputType()
export class LogoutInput implements ILogout {
  @Field(() => ID)
  sessionId: string;

  @Field(() => ID)
  userId: string;
}
