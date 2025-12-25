import { IUser, CreateUserDto } from 'shared';

export interface IRabbitmqUsersServiceInterface {
  createUser(user: CreateUserDto): Promise<IUser>;
  findOneById(id: string): Promise<IUser | null>;
}
