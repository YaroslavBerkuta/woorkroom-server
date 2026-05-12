import { Controller, Inject } from '@nestjs/common';
import * as types from '../types';
import { EmployeeService } from '../services';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateEmployeeDto } from 'shared';

@Controller()
export class EmployeeController {
  constructor(
    @Inject(EmployeeService.name)
    private readonly employeeService: types.IEmployeeService,
  ) {}

  @GrpcMethod('CompanysService', 'CreateEmployee')
  createEmployee(dto: CreateEmployeeDto) {
    return this.employeeService.createEmployee(dto);
  }

  @GrpcMethod('CompanysService', 'DeleteEmployee')
  async deleteEmployee(dto: { id: string }) {
    const value = await this.employeeService.deleteEmployee(dto.id);
    return { value };
  }

  @GrpcMethod('CompanysService', 'GetMyCompanys')
  async getMyCompanys(dto: { userId: string }) {
    const companies = await this.employeeService.getMyCompanys(dto.userId);
    return { companies };
  }

  @GrpcMethod('CompanysService', 'GetMyCompanyProfile')
  getMyCompanyProfile(dto: { companyId: string; userId: string }) {
    return this.employeeService.getMyCompanyProfile(dto.companyId, dto.userId);
  }
}
