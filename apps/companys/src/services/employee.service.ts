import { Inject, Injectable } from '@nestjs/common';
import type { ICompanyServiceInterface, IEmployeeService } from '../types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entitys';
import { CreateEmployeeDto, UpdateEmployeeDto } from 'shared';
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

    return this.employeeRepository.save({
      ...dto,
      birthday: dto.birthday || undefined,
    });
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

  async updateEmployee(dto: UpdateEmployeeDto) {
    const employee = await this.employeeRepository.findOne({
      where: { id: dto.id },
    });

    if (!employee) {
      throw new RpcException('Employee not found');
    }

    Object.assign(employee, {
      name: dto.name ?? employee.name,
      lastName: dto.lastName ?? employee.lastName,
      avatar: dto.avatar ?? employee.avatar,
      position: dto.position ?? employee.position,
      location: dto.location ?? employee.location,
      birthday: dto.birthday || employee.birthday,
    });

    return this.employeeRepository.save(employee);
  }

  async getMyCompanyProfile(companyId: string, userId: string) {
    return this.employeeRepository.findOne({ where: { companyId, userId } });
  }
}
