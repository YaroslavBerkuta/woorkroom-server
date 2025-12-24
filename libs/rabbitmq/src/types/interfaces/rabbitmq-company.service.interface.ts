import { CreateCompanyDto, ICompany } from 'shared';

export interface RabbitmqCompanyServiceInterface {
  createCompany(company: CreateCompanyDto): Promise<ICompany>;
}
