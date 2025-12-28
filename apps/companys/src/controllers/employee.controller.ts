import { Controller, Inject } from '@nestjs/common';
import * as types from '../types';
import { EmployeeService } from '../services';
import { MessagePattern } from '@nestjs/microservices';
import { CreateEmployeeDto, EMessageRmqp } from 'shared';

@Controller()
export class EmployeeController {
  constructor(
    @Inject(EmployeeService.name)
    private readonly employeeService: types.IEmployeeService,
  ) {}

  @MessagePattern(EMessageRmqp.CREATE_EMPLOYEE)
  async createEmployee(dto: CreateEmployeeDto) {
    return this.employeeService.createEmployee(dto);
  }

  @MessagePattern(EMessageRmqp.DELETE_EMPLOYEE)
  async deleteEmployee(dto: { id: string }) {
    return this.employeeService.deleteEmployee(dto.id);
  }

  @MessagePattern(EMessageRmqp.GET_MY_COMPANYS)
  async getMyCompanys(dto: { userId: string }) {
    return this.employeeService.getMyCompanys(dto.userId);
  }
}
