import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { UsersService } from '../services';
import { CreateUserDto } from '../dto';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @MessagePattern({ cmd: 'user.create' })
  async createUser(data: CreateUserDto) {
    const user = await this.userService.createUser(data);
    return user;
  }
}
