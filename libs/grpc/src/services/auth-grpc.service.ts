import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { ISession, LoginDto, LogoutDto, RegisterDto } from 'shared';
import { IGrpcAuthService } from '../types';

interface AuthGrpcClient {
  register(data: any): Observable<any>;
  login(data: any): Observable<any>;
  logout(data: any): Observable<any>;
  getSession(data: any): Observable<any>;
  getUserSessions(data: any): Observable<any>;
  selectCompany(data: any): Observable<any>;
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

  async selectCompany(data: { sessionId: string; companyId: string }): Promise<ISession> {
    return lastValueFrom(this.client.selectCompany(data));
  }
}
