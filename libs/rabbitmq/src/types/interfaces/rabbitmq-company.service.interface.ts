import {
  CreateCompanyDto,
  CreateEmployeeDto,
  ICompany,
  IEmployee,
} from 'shared';

export interface IRabbitmqCompanyService {
  createCompany(company: CreateCompanyDto): Promise<ICompany>;
  createEmployee(employee: CreateEmployeeDto): Promise<IEmployee>;
  deleteCompany(id: string): Promise<boolean>;
  deleteEmployee(id: string): Promise<boolean>;
  getMyCompanys(userId: string): Promise<ICompany[]>;
}
