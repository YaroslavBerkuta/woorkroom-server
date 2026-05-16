import { ISession, LoginDto, RegisterDto } from 'shared';

export interface IAuthorizationService {
  sendVerificationCode(phone: string): Promise<boolean>;
  registerUser(dto: RegisterDto): Promise<boolean>;
  loginUser(dto: LoginDto): Promise<ISession>;
  logoutUser(sessionId: string, userId: string): Promise<boolean>;
  getSession(sessionId: string): Promise<ISession | null>;
  getUserSessions(userId: string): Promise<ISession[]>;
  selectCompany(sessionId: string, companyId: string): Promise<ISession>;
}
