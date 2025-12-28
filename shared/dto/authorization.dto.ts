import { ILogin, ILogout } from 'shared/types';
import { CreateCompanyDto, CreateUserDto } from '.';

export class RegisterDto {
  user: CreateUserDto;
  code: string;
  company: CreateCompanyDto;
}

export class LoginDto {
  email: string;
  password: string;
}

export class LogoutDto {
  sessionId: string;
  userId: string;
}
