import { IBase } from './base.interface';

export interface IUser extends IBase {
  email: string;
  password: string;
  phoneNumber: string;
}
