import { Controller, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { AuthorizationService } from '../services';
import * as types from '../types';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from 'shared';

@Controller()
export class AuthorizationController {
  private readonly logger = new Logger(AuthorizationController.name);

  constructor(
    @Inject(AuthorizationService.name)
    private readonly authorizationService: types.IAuthorizationService,
  ) {}

  @GrpcMethod('AuthService', 'SendVerificationCode')
  async sendVerificationCode(data: { phone: string }) {
    this.logger.log(`SendVerificationCode: ${data.phone}`);
    const value = await this.authorizationService.sendVerificationCode(data.phone);
    return { value };
  }

  @GrpcMethod('AuthService', 'Register')
  async registerUser(data: RegisterDto) {
    this.logger.log(`Register user: ${JSON.stringify(data)}`);
    const value = await this.authorizationService.registerUser(data);
    return { value };
  }

  @GrpcMethod('AuthService', 'Login')
  loginUser(data: LoginDto) {
    this.logger.log(`Login user: ${JSON.stringify(data)}`);
    return this.authorizationService.loginUser(data);
  }

  @GrpcMethod('AuthService', 'Logout')
  async logoutUser(data: { sessionId: string; userId: string }) {
    const value = await this.authorizationService.logoutUser(
      data.sessionId,
      data.userId,
    );
    return { value };
  }

  @GrpcMethod('AuthService', 'GetSession')
  getSession(data: { sessionId: string }) {
    return this.authorizationService.getSession(data.sessionId);
  }

  @GrpcMethod('AuthService', 'GetUserSessions')
  async getUserSessions(data: { userId: string }) {
    const sessions = await this.authorizationService.getUserSessions(
      data.userId,
    );
    return { sessions };
  }

  @GrpcMethod('AuthService', 'SelectCompany')
  selectCompany(data: { sessionId: string; companyId: string }) {
    return this.authorizationService.selectCompany(
      data.sessionId,
      data.companyId,
    );
  }
}
