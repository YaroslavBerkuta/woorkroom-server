import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError, timeout } from 'rxjs';
import { EMessageRmqp, IUser, CreateUserDto } from 'shared';
import * as types from '../types';

@Injectable()
export class RabbitmqUsersService implements types.IRabbitmqUsersService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  public async createUser(user: CreateUserDto): Promise<IUser> {
    return lastValueFrom(
      this.userService.send<IUser>(EMessageRmqp.CREATE_USER, user).pipe(
        timeout(10_000),
        catchError((err) =>
          throwError(
            () => new RpcException(err?.message || 'USER_SERVICE error'),
          ),
        ),
      ),
    );
  }

  public async findOneById(id: string) {
    return lastValueFrom(
      this.userService.send<IUser>(EMessageRmqp.FIND_USER_BY_ID, id).pipe(
        timeout(10_000),
        catchError((err) =>
          throwError(
            () => new RpcException(err?.message || 'USER_SERVICE error'),
          ),
        ),
      ),
    );
  }

  public async findOneByEmail(email: string) {
    return lastValueFrom(
      this.userService.send<IUser>(EMessageRmqp.FIND_USER_BY_EMAIL, email).pipe(
        timeout(10_000),
        catchError((err) =>
          throwError(
            () => new RpcException(err?.message || 'USER_SERVICE error'),
          ),
        ),
      ),
    );
  }

  public async deleteUserById(id: string): Promise<boolean> {
    return lastValueFrom(
      this.userService
        .send<boolean>(EMessageRmqp.DELETE_USER_BY_ID, { id })
        .pipe(
          timeout(10_000),
          catchError((err) =>
            throwError(
              () => new RpcException(err?.message || 'USER_SERVICE error'),
            ),
          ),
        ),
    );
  }

  public async verifyPassword(hashValue: string, password: string) {
    return lastValueFrom(
      this.userService
        .send<boolean>(EMessageRmqp.VERIFY_PASSWORD, { hashValue, password })
        .pipe(
          timeout(10_000),
          catchError((err) =>
            throwError(
              () => new RpcException(err?.message || 'USER_SERVICE error'),
            ),
          ),
        ),
    );
  }
}
