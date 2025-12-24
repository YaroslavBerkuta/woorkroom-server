import { CreateCompanyDto, ICompany, UpdateCompanyDto } from 'shared';
import { DeleteResult } from 'typeorm';

export interface ICompanyServiceInterface {
  createCompany(dto: CreateCompanyDto): Promise<ICompany>;
  updateCompany(
    id: string,
    dto: Omit<UpdateCompanyDto, 'id'>,
  ): Promise<ICompany>;
  findCompanyById(id: string): Promise<ICompany | null>;
  deleteCompanyById(id: string): Promise<DeleteResult>;
}
