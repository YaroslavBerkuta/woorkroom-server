import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError, timeout } from 'rxjs';
import {
  EMessageRmqp,
  IUser,
  CreateUserDto,
  CreateProfileDto,
  IProfile,
} from 'shared';
import { IRabbitmqUsersServiceInterface } from '../types';

@Injectable()
export class RabbitmqUsersService implements IRabbitmqUsersServiceInterface {
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

  public async createProfile(profile: CreateProfileDto): Promise<IProfile> {
    return lastValueFrom(
      this.userService
        .send<IProfile>(EMessageRmqp.CREATE_PROFILE, profile)
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
