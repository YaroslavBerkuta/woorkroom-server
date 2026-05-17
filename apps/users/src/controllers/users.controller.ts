import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateUserDto } from 'shared';
import { UsersService } from '../services';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'CreateUser')
  createUser(data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @GrpcMethod('UsersService', 'FindUserById')
  findUserById(data: { id: string }) {
    return this.usersService.findOneById(data.id);
  }

  @GrpcMethod('UsersService', 'FindUserByEmail')
  findUserByEmail(data: { email: string }) {
    return this.usersService.findOneByEmail(data.email);
  }

  @GrpcMethod('UsersService', 'DeleteUserById')
  async deleteUserById(data: { id: string }) {
    const value = await this.usersService.deleteById(data.id);
    return { value };
  }

  @GrpcMethod('UsersService', 'VerifyPassword')
  async verifyPassword(data: { hashValue: string; password: string }) {
    const value = await this.usersService.verifyPassword(
      data.hashValue,
      data.password,
    );
    return { value };
  }
}
