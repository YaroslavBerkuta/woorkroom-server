import { Injectable } from '@nestjs/common';
import { IEmployeeServiceInterface } from '../types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entitys';
import { CreateEmployeeDto } from 'shared';

@Injectable()
export class EmployeeService implements IEmployeeServiceInterface {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async createEmployee(dto: CreateEmployeeDto) {
    const existEmployee = await this.findExistCompanyEmployee(
      dto.companyId,
      dto.profileId,
    );

    if (existEmployee) {
      throw new Error('Employee already exists');
    }

    return this.employeeRepository.save(dto);
  }

  async findExistCompanyEmployee(companyId: string, profileId: string) {
    return this.employeeRepository.findOne({ where: { companyId, profileId } });
  }

  async deleteEmployee(id: string) {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new Error('Employee not found');
    }
    return this.employeeRepository.delete(id);
  }
}
