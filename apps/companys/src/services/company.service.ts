import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Companys } from '../entitys';
import { CreateCompanyDto, UpdateCompanyDto } from 'shared';
import { ICompanyServiceInterface } from '../types';
import { omit } from 'lodash';

@Injectable()
export class CompanyService implements ICompanyServiceInterface {
  constructor(
    @InjectRepository(Companys)
    private readonly companyRepository: Repository<Companys>,
  ) {}

  async createCompany(dto: CreateCompanyDto) {
    const company = this.companyRepository.save(omit(dto, 'employees'));
    return company;
  }

  async updateCompany(id: string, dto: Omit<UpdateCompanyDto, 'id'>) {
    const existCompany = await this.findCompanyById(id);

    if (!existCompany) {
      throw new NotFoundException('Company not found');
    }

    this.companyRepository.update(id, omit(dto, 'id'));

    const updatedCompany = await this.findCompanyById(id);

    if (!updatedCompany) {
      throw new NotFoundException('Company not found');
    }

    return updatedCompany;
  }

  async findCompanyById(id: string) {
    return this.companyRepository.findOneBy({ id });
  }

  async deleteCompanyById(id: string) {
    const existCompany = await this.findCompanyById(id);

    if (!existCompany) {
      throw new NotFoundException('Company not found');
    }
    const result = await this.companyRepository.delete(id);
    return !!result.affected;
  }
}
