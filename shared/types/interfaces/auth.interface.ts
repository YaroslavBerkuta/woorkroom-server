import { IBase, ICompany } from '.';

export interface ISession {
  sessionId: string;
  expiresIn: number;
  userId: string;
  createdAt: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  code: string;
  company: Omit<ICompany, keyof IBase>;
}

export interface ILogout {
  sessionId: string;
  userId: string;
}
