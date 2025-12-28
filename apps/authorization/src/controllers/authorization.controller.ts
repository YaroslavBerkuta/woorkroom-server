import { Controller } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { AuthorizationService } from '../services';
import * as types from '../types';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EMessageRmqp, LoginDto, RegisterDto } from 'shared';

@Controller()
export class AuthorizationController {
  constructor(
    @Inject(AuthorizationService.name)
    private readonly authorizationService: types.IAuthorizationService,
  ) {}

  @MessagePattern(EMessageRmqp.REGISTER)
  registerUser(@Payload() data: RegisterDto) {
    return this.authorizationService.registerUser(data);
  }

  @MessagePattern(EMessageRmqp.LOGIN)
  loginUser(@Payload() data: LoginDto) {
    return this.authorizationService.loginUser(data);
  }

  @MessagePattern(EMessageRmqp.LOGOUT)
  logoutUser(@Payload() data: { sessionId: string; userId: string }) {
    return this.authorizationService.logoutUser(data.sessionId, data.userId);
  }

  @MessagePattern(EMessageRmqp.GET_SESSION)
  getSession(@Payload() data: { sessionId: string }) {
    return this.authorizationService.getSession(data.sessionId);
  }

  @MessagePattern(EMessageRmqp.GET_USER_SESSIONS)
  getUserSessions(@Payload() data: { userId: string }) {
    return this.authorizationService.getUserSessions(data.userId);
  }
}
