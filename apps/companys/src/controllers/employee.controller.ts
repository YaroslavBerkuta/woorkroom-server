import { Controller } from '@nestjs/common';
import { EmployeeService } from '@/services';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateEmployeeDto, UpdateEmployeeDto } from 'shared';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

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

  @GrpcMethod('CompanysService', 'UpdateEmployee')
  updateEmployee(dto: UpdateEmployeeDto) {
    return this.employeeService.updateEmployee(dto);
  }

  @GrpcMethod('CompanysService', 'GetMyCompanyProfile')
  getMyCompanyProfile(dto: { companyId: string; userId: string }) {
    return this.employeeService.getMyCompanyProfile(dto.companyId, dto.userId);
  }

  @GrpcMethod('CompanysService', 'GetCompanyMembers')
  async getCompanyMembers(dto: { id: string }) {
    const employees = await this.employeeService.getCompanyMembers(dto.id);
    return { employees };
  }
}
