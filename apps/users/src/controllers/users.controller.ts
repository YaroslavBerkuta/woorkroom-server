import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EMessageRmqp, CreateUserDto, UpdateUserDto } from 'shared';
import { UsersService } from '../services';
import { omit } from 'lodash';
import type { IUserServiceInterface } from '../types';

@Controller()
export class UsersController {
  constructor(
    @Inject(UsersService.name)
    private readonly usersService: IUserServiceInterface,
  ) {}

  @MessagePattern(EMessageRmqp.CREATE_USER)
  public async createUser(@Payload() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @MessagePattern(EMessageRmqp.UPDATE_USER)
  public async updateUser(@Payload() data: UpdateUserDto) {
    return this.usersService.updateById(data.id, omit(data, ['id']));
  }

  @MessagePattern(EMessageRmqp.FIND_USER_BY_ID)
  public async findUserById(@Payload() id: string) {
    return this.usersService.findOneById(id);
  }

  @MessagePattern(EMessageRmqp.FIND_USER_BY_EMAIL)
  public async findUserByEmail(@Payload() data: { email: string }) {
    return this.usersService.findOneByEmail(data.email);
  }

  @MessagePattern(EMessageRmqp.DELETE_USER_BY_ID)
  public async deleteUserById(@Payload() data: { id: string }) {
    return this.usersService.deleteById(data.id);
  }
}
