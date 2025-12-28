import { UserRole, UserStatus } from '../enums';
import { IBase } from './base.interface';

export interface ICompany extends IBase {
  name: string;
  service?: string;
  describes?: string;
  logo?: string;
  direction?: string;
  peopleCountStart: number;
  peopleCountEnd: number;
}

export interface IEmployee extends IBase {
  companyId: string;
  userId: string;
  name?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  position?: string;
  location?: string;
  birthday?: Date;
}

export interface IUpdateCompany extends Partial<ICompany> {
  id: string;
}
