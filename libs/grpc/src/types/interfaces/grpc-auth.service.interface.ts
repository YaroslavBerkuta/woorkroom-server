import { ISession, LoginDto, LogoutDto, RegisterDto } from 'shared';

export interface IGrpcAuthService {
  sendVerificationCode(data: { phone: string }): Promise<boolean>;
  registerUser(data: RegisterDto): Promise<boolean>;
  loginUser(data: LoginDto): Promise<ISession>;
  logoutUser(data: LogoutDto): Promise<boolean>;
  getSession(data: { sessionId: string }): Promise<ISession>;
  getUserSessions(data: { userId: string }): Promise<ISession[]>;
  selectCompany(data: {
    sessionId: string;
    companyId: string;
  }): Promise<ISession>;
}
