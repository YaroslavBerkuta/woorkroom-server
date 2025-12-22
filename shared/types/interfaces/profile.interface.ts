import { UserRole, UserStatus } from '../enums';

export interface IProfile {
  id: string;
  userId: string;
  companyId: string;
  name?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  position?: string;
  location?: string;
  birthday?: Date;
}
