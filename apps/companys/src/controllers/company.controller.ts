import { Controller, Inject } from '@nestjs/common';
import type { ICompanyServiceInterface } from '../types';
import { CompanyService } from '../services';
import { CreateCompanyDto, UpdateCompanyDto } from 'shared';
import { GrpcMethod } from '@nestjs/microservices';
import { omit } from 'lodash';

@Controller()
export class CompanysController {
  constructor(
    @Inject(CompanyService.name)
    private readonly companysService: ICompanyServiceInterface,
  ) {}

  @GrpcMethod('CompanysService', 'CreateCompany')
  createCompany(data: CreateCompanyDto) {
    return this.companysService.createCompany(data);
  }

  @GrpcMethod('CompanysService', 'UpdateCompany')
  updateCompany(data: UpdateCompanyDto) {
    return this.companysService.updateCompany(data.id, omit(data, ['id']));
  }

  @GrpcMethod('CompanysService', 'DeleteCompany')
  async deleteCompany(data: { id: string }) {
    const value = await this.companysService.deleteCompanyById(data.id);
    return { value };
  }

  @GrpcMethod('CompanysService', 'FindCompanyById')
  findCompanyById(data: { id: string }) {
    return this.companysService.findCompanyById(data.id);
  }
}
