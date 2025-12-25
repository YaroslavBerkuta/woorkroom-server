import { LoginDto, RegisterDto } from 'shared';

export interface IAuthorizationService {
  registerUser(dto: RegisterDto): Promise<void>;
  loginUser(dto: LoginDto): Promise<void>;
}
