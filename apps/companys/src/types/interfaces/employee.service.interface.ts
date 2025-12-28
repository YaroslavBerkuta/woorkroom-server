import { CreateEmployeeDto, ICompany, IEmployee } from 'shared';

export interface IEmployeeService {
  createEmployee(dto: CreateEmployeeDto): Promise<IEmployee>;
  findExistCompanyEmployee(
    companyId: string,
    userId: string,
  ): Promise<IEmployee | null>;
  deleteEmployee(id: string): Promise<boolean>;
  getMyCompanys(userId: string): Promise<ICompany[]>;
}
