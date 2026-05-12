import { CreateUserDto, IUser } from 'shared';

export interface IGrpcUsersService {
  createUser(user: CreateUserDto): Promise<IUser>;
  findOneById(id: string): Promise<IUser | null>;
  findOneByEmail(email: string): Promise<IUser | null>;
  deleteUserById(id: string): Promise<boolean>;
  verifyPassword(hashValue: string, password: string): Promise<boolean>;
}
