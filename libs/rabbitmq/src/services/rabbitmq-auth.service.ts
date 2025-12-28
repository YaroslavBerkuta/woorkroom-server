import { Injectable } from '@nestjs/common';
import { IRabbitmqAuthService } from '../types';
import { Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { EMessageRmqp, LoginDto, RegisterDto } from 'shared';
import { catchError, lastValueFrom, throwError, timeout } from 'rxjs';

@Injectable()
export class RabbitmqAuthService implements IRabbitmqAuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}
  registerUser(data: RegisterDto) {
    return lastValueFrom(
      this.authService.send(EMessageRmqp.REGISTER, data).pipe(
        timeout(10_000),
        catchError((err) =>
          throwError(
            () => new RpcException(err?.message || 'AUTH_SERVICE error'),
          ),
        ),
      ),
    );
  }

  public async loginUser(data: LoginDto) {
    return lastValueFrom(
      this.authService.send(EMessageRmqp.LOGIN, data).pipe(
        timeout(10_000),
        catchError((err) =>
          throwError(
            () => new RpcException(err?.message || 'AUTH_SERVICE error'),
          ),
        ),
      ),
    );
  }

  public async logoutUser(data: { sessionId: string; userId: string }) {
    return lastValueFrom(
      this.authService.send(EMessageRmqp.LOGOUT, data).pipe(
        timeout(10_000),
        catchError((err) =>
          throwError(
            () => new RpcException(err?.message || 'AUTH_SERVICE error'),
          ),
        ),
      ),
    );
  }

  public async getSession(data: { sessionId: string }) {
    return lastValueFrom(
      this.authService.send(EMessageRmqp.GET_SESSION, data).pipe(
        timeout(10_000),
        catchError((err) =>
          throwError(
            () => new RpcException(err?.message || 'AUTH_SERVICE error'),
          ),
        ),
      ),
    );
  }

  public async getUserSessions(data: { userId: string }) {
    return lastValueFrom(
      this.authService.send(EMessageRmqp.GET_USER_SESSIONS, data).pipe(
        timeout(10_000),
        catchError((err) =>
          throwError(
            () => new RpcException(err?.message || 'AUTH_SERVICE error'),
          ),
        ),
      ),
    );
  }
}
