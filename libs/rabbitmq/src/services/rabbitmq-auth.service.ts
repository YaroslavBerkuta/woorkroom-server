import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { EMessageRmqp, ISession, LoginDto, RegisterDto } from 'shared';
import { catchError, lastValueFrom, throwError, timeout } from 'rxjs';
import { IRabbitmqAuthService } from 'woorkroom/rabbitmq/types/interfaces/rabbitmq-auth.service.interfcace';

@Injectable()
export class RabbitmqAuthService implements IRabbitmqAuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}
  registerUser(data: RegisterDto): Promise<boolean> {
    return lastValueFrom(
      this.authService.send<boolean>(EMessageRmqp.REGISTER, data).pipe(
        timeout(10_000),
        catchError((err: unknown) =>
          throwError(
            () =>
              new RpcException((err as Error)?.message || 'AUTH_SERVICE error'),
          ),
        ),
      ),
    );
  }

  public async loginUser(data: LoginDto): Promise<ISession> {
    return lastValueFrom(
      this.authService.send<ISession>(EMessageRmqp.LOGIN, data).pipe(
        timeout(10_000),
        catchError((err: unknown) =>
          throwError(
            () =>
              new RpcException((err as Error)?.message || 'AUTH_SERVICE error'),
          ),
        ),
      ),
    );
  }

  public async logoutUser(data: {
    sessionId: string;
    userId: string;
  }): Promise<boolean> {
    return lastValueFrom(
      this.authService.send<boolean>(EMessageRmqp.LOGOUT, data).pipe(
        timeout(10_000),
        catchError((err: unknown) =>
          throwError(
            () =>
              new RpcException((err as Error)?.message || 'AUTH_SERVICE error'),
          ),
        ),
      ),
    );
  }

  public async getSession(data: { sessionId: string }): Promise<ISession> {
    return lastValueFrom(
      this.authService.send<ISession>(EMessageRmqp.GET_SESSION, data).pipe(
        timeout(10_000),
        catchError((err: unknown) =>
          throwError(
            () =>
              new RpcException((err as Error)?.message || 'AUTH_SERVICE error'),
          ),
        ),
      ),
    );
  }

  public async getUserSessions(data: { userId: string }): Promise<ISession[]> {
    return lastValueFrom(
      this.authService
        .send<ISession[]>(EMessageRmqp.GET_USER_SESSIONS, data)
        .pipe(
          timeout(10_000),
          catchError((err: unknown) =>
            throwError(
              () =>
                new RpcException(
                  (err as Error)?.message || 'AUTH_SERVICE error',
                ),
            ),
          ),
        ),
    );
  }
}
