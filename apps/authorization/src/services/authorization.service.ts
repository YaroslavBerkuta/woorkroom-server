import { Injectable } from '@nestjs/common';
import { IAuthorizationService } from '../types';
import { LoginDto, RegisterDto } from 'shared';

@Injectable()
export class AuthorizationService implements IAuthorizationService {
  constructor() {}
  registerUser(dto: RegisterDto): Promise<void> {
    throw new Error('Method not implemented.');
  }
  loginUser(dto: LoginDto): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
