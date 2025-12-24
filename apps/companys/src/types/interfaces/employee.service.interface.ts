import { CreateEmployeeDto, IEmployee } from 'shared';
import { DeleteResult } from 'typeorm';

export interface IEmployeeServiceInterface {
  createEmployee(dto: CreateEmployeeDto): Promise<IEmployee>;
  findExistCompanyEmployee(
    companyId: string,
    profileId: string,
  ): Promise<IEmployee | null>;
  deleteEmployee(id: string): Promise<DeleteResult>;
}
