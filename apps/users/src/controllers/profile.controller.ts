import { Controller, Inject } from '@nestjs/common';
import { ProfilesService } from '../services';
import type { IProfileServiceInterface } from '../types';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProfileDto, EMessageRmqp } from 'shared';

@Controller()
export class ProfileController {
  constructor(
    @Inject(ProfilesService.name)
    private readonly profileService: IProfileServiceInterface,
  ) {}

  @MessagePattern(EMessageRmqp.CREATE_PROFILE)
  public async createProfile(@Payload() data: CreateProfileDto) {
    return this.profileService.create(data);
  }
}
