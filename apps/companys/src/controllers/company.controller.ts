import { Controller } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { ICompanyServiceInterface } from '../types';
import { CompanyService } from '../services';
import { CreateCompanyDto, EMessageRmqp, UpdateCompanyDto } from 'shared';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { omit } from 'lodash';

@Controller()
export class CompanysController {
  constructor(
    @Inject(CompanyService.name)
    private readonly companysService: ICompanyServiceInterface,
  ) {}

  @MessagePattern(EMessageRmqp.CREATE_COMPANY)
  public async createCompany(@Payload() data: CreateCompanyDto) {
    return this.companysService.createCompany(data);
  }

  @MessagePattern(EMessageRmqp.UPDATE_COMPANY)
  public async updateCompany(@Payload() data: UpdateCompanyDto) {
    return this.companysService.updateCompany(data.id, omit(data, ['id']));
  }

  @MessagePattern(EMessageRmqp.DELETE_COMPANY)
  public async deleteCompany(@Payload() data: { id: string }) {
    return this.companysService.deleteCompanyById(data.id);
  }

  @MessagePattern(EMessageRmqp.FIND_COMPANY_BY_ID)
  public async findCompanyById(@Payload() data: { id: string }) {
    return this.companysService.findCompanyById(data.id);
  }
}
