import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { ISession, LoginDto, LogoutDto, RegisterDto } from 'shared';
import { IGrpcAuthService } from '../types';

interface BoolResponse {
  value: boolean;
}

interface SessionListResponse {
  sessions: ISession[];
}

interface AuthGrpcClient {
  sendVerificationCode(data: unknown): Observable<BoolResponse>;
  register(data: unknown): Observable<BoolResponse>;
  login(data: unknown): Observable<ISession>;
  logout(data: unknown): Observable<BoolResponse>;
  getSession(data: unknown): Observable<ISession>;
  getUserSessions(data: unknown): Observable<SessionListResponse>;
  selectCompany(data: unknown): Observable<ISession>;
}

@Injectable()
export class GrpcAuthService implements IGrpcAuthService, OnModuleInit {
  private client: AuthGrpcClient;

  constructor(
    @Inject('AUTH_GRPC_CLIENT') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.client = this.grpcClient.getService<AuthGrpcClient>('AuthService');
  }

  async sendVerificationCode(data: { phone: string }): Promise<boolean> {
    const res = await lastValueFrom(this.client.sendVerificationCode(data));
    return res.value;
  }

  async registerUser(data: RegisterDto): Promise<boolean> {
    const res = await lastValueFrom(this.client.register(data));
    return res.value;
  }

  async loginUser(data: LoginDto): Promise<ISession> {
    return lastValueFrom(this.client.login(data));
  }

  async logoutUser(data: LogoutDto): Promise<boolean> {
    const res = await lastValueFrom(this.client.logout(data));
    return res.value;
  }

  async getSession(data: { sessionId: string }): Promise<ISession> {
    return lastValueFrom(this.client.getSession(data));
  }

  async getUserSessions(data: { userId: string }): Promise<ISession[]> {
    const res = await lastValueFrom(this.client.getUserSessions(data));
    return res.sessions ?? [];
  }

  async selectCompany(data: {
    sessionId: string;
    companyId: string;
  }): Promise<ISession> {
    return lastValueFrom(this.client.selectCompany(data));
  }
}
