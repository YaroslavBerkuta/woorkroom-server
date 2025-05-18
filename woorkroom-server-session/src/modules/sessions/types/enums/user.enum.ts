import { registerEnumType } from '@nestjs/graphql';

export enum UserStatus {
  ACTIVE,
  INACTIVE,
}

export enum UserRole {
  OWNER,
  USER,
  SUPER_ADMIN,
}

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
