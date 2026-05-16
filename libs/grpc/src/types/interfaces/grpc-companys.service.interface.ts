import { CreateCompanyDto, CreateEmployeeDto, UpdateEmployeeDto, ICompany, IEmployee } from 'shared';

export interface IGrpcCompanyService {
  createCompany(company: CreateCompanyDto): Promise<ICompany>;
  createEmployee(employee: CreateEmployeeDto): Promise<IEmployee>;
  updateEmployee(dto: UpdateEmployeeDto): Promise<IEmployee>;
  deleteCompany(id: string): Promise<boolean>;
  deleteEmployee(id: string): Promise<boolean>;
  getMyCompanys(userId: string): Promise<ICompany[]>;
  getCompanyById(companyId: string): Promise<ICompany | null>;
  getMyCompanyProfile(companyId: string, userId: string): Promise<IEmployee | null>;
  getCompanyMembers(companyId: string): Promise<IEmployee[]>;
}
