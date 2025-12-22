import { UserRole, UserStatus } from '../types';

export class CreateProfileDto {
  userId: string;
  companyId: string;
  name?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
  avatar?: string;
  position?: string;
  location?: string;
  birthday?: Date;
}
