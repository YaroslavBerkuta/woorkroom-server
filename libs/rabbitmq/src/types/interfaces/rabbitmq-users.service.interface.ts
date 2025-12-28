import { IUser, CreateUserDto } from 'shared';

export interface IRabbitmqUsersService {
  createUser(user: CreateUserDto): Promise<IUser>;
  findOneById(id: string): Promise<IUser | null>;
  findOneByEmail(email: string): Promise<IUser | null>;
  deleteUserById(id: string): Promise<boolean>;
}
