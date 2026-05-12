import { Inject, Injectable } from '@nestjs/common';
import type { ICompanyServiceInterface, IEmployeeService } from '../types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entitys';
import { CreateEmployeeDto } from 'shared';
import { CompanyService } from './company.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EmployeeService implements IEmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @Inject(CompanyService.name)
    private readonly companysService: ICompanyServiceInterface,
  ) {}

  async createEmployee(dto: CreateEmployeeDto) {
    const existEmployee = await this.findExistCompanyEmployee(
      dto.companyId,
      dto.userId,
    );

    if (existEmployee) {
      throw new RpcException('Employee already exists');
    }

    return this.employeeRepository.save(dto);
  }

  async findExistCompanyEmployee(companyId: string, userId: string) {
    return this.employeeRepository.findOne({ where: { companyId, userId } });
  }

  async deleteEmployee(id: string) {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new RpcException('Employee not found');
    }
    const result = await this.employeeRepository.delete(id);
    return !!result.affected;
  }

  async getMyCompanys(userId: string) {
    const myCompanys = await this.employeeRepository.find({
      where: { userId },
    });

    const companys = await Promise.all(
      myCompanys.map((company) =>
        this.companysService.findCompanyById(company.companyId),
      ),
    );

    const resCompanys = companys.filter((company) => company !== null);

    return resCompanys;
  }

  async getMyCompanyProfile(companyId: string, userId: string) {
    return this.employeeRepository.findOne({ where: { companyId, userId } });
  }
}
