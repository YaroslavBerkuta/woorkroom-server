import { UserRole, UserStatus } from '../enums/user.enum';

export interface IUser {
  id: number;
  email: string;
  name?: string;
  password: string;
  phoneNumber: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
