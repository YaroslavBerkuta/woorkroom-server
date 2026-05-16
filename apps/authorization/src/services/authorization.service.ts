import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IAuthorizationService } from '../types';
import {
  ICompany,
  IEmployee,
  ISession,
  IUser,
  LoginDto,
  RegisterDto,
  UserRole,
  UserStatus,
} from 'shared';
import * as redis from 'woorkroom/redis';
import { ConfigService } from '@nestjs/config';
import * as grpc from 'woorkroom/grpc';
import * as rmq from 'woorkroom/rabbitmq';
import { v4 } from 'uuid';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthorizationService
  implements IAuthorizationService, OnModuleInit
{
  private SESSION_TTL_SECONDS: number;
  private readonly logger = new Logger(AuthorizationService.name);

  constructor(
    @Inject(redis.RedisService.name)
    private readonly redisService: redis.IRedisService,
    @Inject(grpc.GrpcUsersService.name)
    private readonly grpcUsersService: grpc.IGrpcUsersService,
    @Inject(grpc.GrpcCompanysService.name)
    private readonly grpcCompaniesService: grpc.IGrpcCompanyService,
    @Inject(rmq.RabbitmqMailsService.name)
    private readonly rabbitmqMailsService: rmq.IRabbitmqMailsService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const days = this.configService.get<number>('authorization.sessionDays');
    if (!days) {
      throw new Error('Authorization session days is not defined');
    }
    this.SESSION_TTL_SECONDS = 60 * 60 * 24 * days;
  }

  async sendVerificationCode(phone: string): Promise<boolean> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const normalizedPhone = phone.replace(/\D/g, '');

    await this.redisService.ttl(`verify:code:${normalizedPhone}`, code, 60 * 5);
    (this.rabbitmqMailsService.sendVerificationCode(normalizedPhone, code) as any).subscribe();

    this.logger.log(`Verification code sent to phone ${normalizedPhone}`);
    return true;
  }

  async registerUser(dto: RegisterDto): Promise<boolean> {
    const normalizedPhone = dto.user.phoneNumber.replace(/\D/g, '');
    const savedCode = await this.redisService.get<string>(`verify:code:${normalizedPhone}`);

    if (!savedCode || savedCode !== dto.code) {
      throw new RpcException('Invalid or expired verification code');
    }

    await this.redisService.del(`verify:code:${normalizedPhone}`);

    let user: IUser | null = null;
    let company: ICompany | null = null;
    let employee: IEmployee | null = null;
    try {
      user = await this.grpcUsersService.createUser(dto.user);
      this.logger.log('User created');
      company = await this.grpcCompaniesService.createCompany(dto.company);
      this.logger.log('Company created');
      employee = await this.grpcCompaniesService.createEmployee({
        companyId: company.id,
        userId: user.id,
        role: UserRole.OWNER,
        status: UserStatus.ACTIVE,
        name: user.email,
      });
      this.logger.log('Employee created');
      return true;
    } catch (e) {
      if (employee) {
        await this.grpcCompaniesService.deleteEmployee(employee.id);
        this.logger.warn('Employee deleted');
      }
      if (company) {
        await this.grpcCompaniesService.deleteCompany(company.id);
        this.logger.warn('Company deleted');
      }
      if (user) {
        await this.grpcUsersService.deleteUserById(user.id);
        this.logger.warn('User deleted');
      }
      this.logger.error(e);
      throw new RpcException(e);
    }
  }

  async loginUser(dto: LoginDto): Promise<ISession> {
    const user = await this.grpcUsersService.findOneByEmail(dto.email);

    if (!user) {
      throw new RpcException('User not found');
    }
    this.logger.log('User found');
    const ok = await this.grpcUsersService.verifyPassword(
      user.password,
      dto.password,
    );

    this.logger.log('Password verified');

    if (!ok) {
      throw new RpcException('Invalid password');
    }
    const sid = v4();

    const session: ISession = {
      sessionId: sid,
      userId: user.id,
      expiresIn: this.SESSION_TTL_SECONDS,
      createdAt: new Date().toISOString(),
    };

    this.logger.log('Session created');

    await this.redisService.ttl(
      `session:${sid}`,
      session,
      this.SESSION_TTL_SECONDS,
    );

    await this.redisService.sadd(`user:sessions:${user.id}`, sid);

    return session;
  }

  public async logoutUser(sessionId: string, userId: string) {
    await Promise.allSettled([
      this.redisService.del(`session:${sessionId}`),
      this.redisService.srem(`user:sessions:${userId}`, sessionId),
    ]);
    return true;
  }

  public async getSession(sessionId: string) {
    return this.redisService.get<ISession>(`session:${sessionId}`);
  }

  async getUserSessions(userId: string): Promise<ISession[]> {
    const sessionIds = await this.redisService.smembers(
      `user:sessions:${userId}`,
    );

    if (!sessionIds.length) return [];

    const sessions = await Promise.all(
      sessionIds.map((id) => this.redisService.get<ISession>(`session:${id}`)),
    );

    return sessions
      .filter((session) => session !== null)
      .sort(
        (a, b) =>
          (Date.parse(b.createdAt ?? '') || 0) -
          (Date.parse(a.createdAt ?? '') || 0),
      );
  }

  async selectCompany(sessionId: string, companyId: string): Promise<ISession> {
    const session = await this.redisService.get<ISession>(`session:${sessionId}`);

    if (!session) {
      throw new RpcException('Session not found');
    }

    const updatedSession: ISession = { ...session, companyId };

    await this.redisService.ttl(
      `session:${sessionId}`,
      updatedSession,
      this.SESSION_TTL_SECONDS,
    );

    return updatedSession;
  }

}
