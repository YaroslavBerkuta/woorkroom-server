import {
  Directive,
  Field,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { UserRole, UserStatus } from '@prisma/client';
import { IUser } from '../types';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'The basic user roles',
  valuesMap: {
    OWNER: { description: 'Owner of the system' },
    USER: { description: 'Default user' },
    SUPER_ADMIN: { description: 'Super admin of the system' },
  },
});

registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: 'The basic user status',
  valuesMap: {
    ACTIVE: { description: 'Active user' },
    INACTIVE: { description: 'Inactive user' },
  },
});

@ObjectType()
@Directive('@key(fields: "id")')
export class Users implements IUser {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  password: string;

  @Field(() => String, { nullable: false })
  phoneNumber: string;

  @Field(() => UserRole, { nullable: true })
  role: UserRole;

  @Field(() => UserStatus, { nullable: true })
  status: UserStatus;

  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}
