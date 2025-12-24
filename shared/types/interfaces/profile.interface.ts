import { UserRole, UserStatus } from '../enums';
import { IBase } from './base.interface';

export interface IProfile extends IBase {
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
