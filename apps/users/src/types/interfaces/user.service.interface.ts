import { IUser, CreateUserDto, UpdateUserDto } from 'shared';
import { DeleteResult } from 'typeorm';

export interface IUserServiceInterface {
  create(dto: CreateUserDto): Promise<IUser>;
  findOneByEmail(email: string): Promise<IUser | null>;
  findOneById(id: string): Promise<IUser | null>;
  deleteById(id: string): Promise<DeleteResult>;
  updateById(id: string, dto: Partial<UpdateUserDto>): Promise<IUser | null>;
}
