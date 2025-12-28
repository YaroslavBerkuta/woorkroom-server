import { UserRole, UserStatus } from 'shared/types';

export class CreateCompanyDto {
  name: string;
  service?: string;
  describes?: string;
  logo?: string;
  direction?: string;
  peopleCountStart: number;
  peopleCountEnd: number;

  employees?: string[];
}

export class UpdateCompanyDto {
  id: string;
  name?: string;
  service?: string;
  describes?: string;
  logo?: string;
  direction?: string;
  peopleCountStart?: number;
  peopleCountEnd?: number;
}

export class CreateEmployeeDto {
  companyId: string;
  userId: string;

  name?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
  avatar?: string;
  position?: string;
  location?: string;
  birthday?: Date;
}
