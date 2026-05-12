import { ISession, LoginDto, LogoutDto, RegisterDto } from 'shared';

export interface IGrpcAuthService {
  registerUser(data: RegisterDto): Promise<boolean>;
  loginUser(data: LoginDto): Promise<ISession>;
  logoutUser(data: LogoutDto): Promise<boolean>;
  getSession(data: { sessionId: string }): Promise<ISession>;
  getUserSessions(data: { userId: string }): Promise<ISession[]>;
}
