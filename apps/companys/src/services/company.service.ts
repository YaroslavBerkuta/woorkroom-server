import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Companys } from '@/entitys';
import { CreateCompanyDto, UpdateCompanyDto } from 'shared';
import { ICompanyServiceInterface } from '@/types';
import { omit } from 'lodash';
import * as redis from 'woorkroom/redis';

@Injectable()
export class CompanyService implements ICompanyServiceInterface {
  constructor(
    @InjectRepository(Companys)
    private readonly companyRepository: Repository<Companys>,
    @Inject(redis.RedisService.name)
    private readonly redis: redis.IRedisService,
  ) {}

  async createCompany(dto: CreateCompanyDto) {
    return this.companyRepository.save(omit(dto, 'employees'));
  }

  async updateCompany(id: string, dto: Omit<UpdateCompanyDto, 'id'>) {
    const existCompany = await this.findCompanyById(id);

    if (!existCompany) {
      throw new NotFoundException('Company not found');
    }

    const updateData = Object.fromEntries(
      Object.entries(omit(dto, 'id')).filter(([, v]) => v !== '' && v !== 0 && v != null),
    );

    if (Object.keys(updateData).length === 0) return existCompany;

    await this.companyRepository.update(id, updateData);
    await this.redis.del(`company:${id}`);

    const updatedCompany = await this.findCompanyById(id);

    if (!updatedCompany) {
      throw new NotFoundException('Company not found');
    }

    return updatedCompany;
  }

  async findCompanyById(id: string) {
    const cached = await this.redis.get<Companys>(`company:${id}`);
    if (cached) return cached;

    const company = await this.companyRepository.findOneBy({ id });
    if (company) await this.redis.ttl(`company:${id}`, company, 60);
    return company;
  }

  async deleteCompanyById(id: string) {
    const existCompany = await this.findCompanyById(id);

    if (!existCompany) {
      throw new NotFoundException('Company not found');
    }

    const result = await this.companyRepository.delete(id);
    await this.redis.del(`company:${id}`);
    return !!result.affected;
  }
}
