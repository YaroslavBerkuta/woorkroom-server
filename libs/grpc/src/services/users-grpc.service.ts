import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { CreateUserDto, IUser } from 'shared';
import { IGrpcUsersService } from '../types';

interface BoolResponse {
  value: boolean;
}

interface UsersGrpcClient {
  createUser(data: unknown): Observable<IUser>;
  findUserById(data: unknown): Observable<IUser>;
  findUserByEmail(data: unknown): Observable<IUser>;
  deleteUserById(data: unknown): Observable<BoolResponse>;
  verifyPassword(data: unknown): Observable<BoolResponse>;
}

@Injectable()
export class GrpcUsersService implements IGrpcUsersService, OnModuleInit {
  private client: UsersGrpcClient;

  constructor(
    @Inject('USERS_GRPC_CLIENT') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.client = this.grpcClient.getService<UsersGrpcClient>('UsersService');
  }

  async createUser(user: CreateUserDto): Promise<IUser> {
    return lastValueFrom(this.client.createUser(user));
  }

  async findOneById(id: string): Promise<IUser | null> {
    try {
      const res = await lastValueFrom(this.client.findUserById({ id }));
      return res?.id ? res : null;
    } catch {
      return null;
    }
  }

  async findOneByEmail(email: string): Promise<IUser | null> {
    try {
      const res = await lastValueFrom(this.client.findUserByEmail({ email }));
      return res?.id ? res : null;
    } catch {
      return null;
    }
  }

  async deleteUserById(id: string): Promise<boolean> {
    const res = await lastValueFrom(this.client.deleteUserById({ id }));
    return res.value;
  }

  async verifyPassword(hashValue: string, password: string): Promise<boolean> {
    const res = await lastValueFrom(
      this.client.verifyPassword({ hashValue, password }),
    );
    return res.value;
  }
}
