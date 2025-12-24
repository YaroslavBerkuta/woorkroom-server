import { IUser, CreateUserDto } from 'shared';

export interface IRabbitmqUsersServiceInterface {
  createUser(user: CreateUserDto): Promise<IUser>;
}
