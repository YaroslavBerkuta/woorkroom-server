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
  profileId: string;
}
