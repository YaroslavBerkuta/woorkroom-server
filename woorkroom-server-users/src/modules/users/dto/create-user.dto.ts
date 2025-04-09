import { Field, InputType } from '@nestjs/graphql';
import { UserRole, UserStatus } from '@prisma/client';

@InputType()
export class CreateUserDto {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: false })
  password: string;

  @Field(() => String, { nullable: false })
  phoneNumber: string;

  @Field(() => UserStatus, {
    nullable: true,
    defaultValue: UserStatus.INACTIVE,
  })
  status?: UserStatus;

  @Field(() => UserRole, { nullable: true, defaultValue: UserRole.USER })
  role?: UserRole;
}
