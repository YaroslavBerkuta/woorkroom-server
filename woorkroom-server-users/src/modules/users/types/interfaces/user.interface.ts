import { UserRole, UserStatus } from "@prisma/client";

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
