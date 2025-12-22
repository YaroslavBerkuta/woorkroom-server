import { IUser, UserDto } from 'shared';

export interface IRabbitmqUsersServiceInterface {
  createUser(user: UserDto): Promise<IUser>;
}
