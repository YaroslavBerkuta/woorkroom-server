import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from '../services';
import { CreateUserDto } from '../dto';
import { QueueCommnadsEnum } from '../types';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @MessagePattern({ cmd: QueueCommnadsEnum.CREATE_USER })
  async createUser(data: CreateUserDto) {
    const user = await this.userService.createUser(data);
    return user;
  }
}
