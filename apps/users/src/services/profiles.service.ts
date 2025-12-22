import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profiles } from '../entitys/profile.entity';
import { CreateProfileDto } from 'shared';
import { IProfileServiceInterface } from '../types';

@Injectable()
export class ProfilesService implements IProfileServiceInterface {
  constructor(
    @InjectRepository(Profiles)
    private readonly profilesRepository: Repository<Profiles>,
  ) {}

  public async create(dto: CreateProfileDto) {
    return this.profilesRepository.save(dto);
  }

  public async findOneByUserIdAndCompanyId(userId: string, companyId: string) {
    return this.profilesRepository.findOneBy({ userId, companyId });
  }

  public async findById(id: string) {
    return this.profilesRepository.findOneBy({ id });
  }
}
