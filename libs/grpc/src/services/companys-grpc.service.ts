import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import {
  CreateCompanyDto,
  CreateEmployeeDto,
  UpdateCompanyDto,
  UpdateEmployeeDto,
  ICompany,
  IEmployee,
} from 'shared';
import { IGrpcCompanyService } from '../types';

interface BoolResponse {
  value: boolean;
}

interface CompanyListResponse {
  companies: ICompany[];
}

interface EmployeeListResponse {
  employees: IEmployee[];
}

interface CompanysGrpcClient {
  createCompany(data: unknown): Observable<ICompany>;
  updateCompany(data: unknown): Observable<ICompany>;
  deleteCompany(data: unknown): Observable<BoolResponse>;
  findCompanyById(data: unknown): Observable<ICompany>;
  createEmployee(data: unknown): Observable<IEmployee>;
  updateEmployee(data: unknown): Observable<IEmployee>;
  deleteEmployee(data: unknown): Observable<BoolResponse>;
  getMyCompanys(data: unknown): Observable<CompanyListResponse>;
  getMyCompanyProfile(data: unknown): Observable<IEmployee>;
  getCompanyMembers(data: unknown): Observable<EmployeeListResponse>;
}

@Injectable()
export class GrpcCompanysService implements IGrpcCompanyService, OnModuleInit {
  private client: CompanysGrpcClient;

  constructor(
    @Inject('COMPANYS_GRPC_CLIENT') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.client =
      this.grpcClient.getService<CompanysGrpcClient>('CompanysService');
  }

  async createCompany(company: CreateCompanyDto): Promise<ICompany> {
    return lastValueFrom(this.client.createCompany(company));
  }

  async updateCompany(dto: UpdateCompanyDto): Promise<ICompany> {
    return lastValueFrom(this.client.updateCompany(dto));
  }

  async createEmployee(employee: CreateEmployeeDto): Promise<IEmployee> {
    return lastValueFrom(this.client.createEmployee(employee));
  }

  async updateEmployee(dto: UpdateEmployeeDto): Promise<IEmployee> {
    return lastValueFrom(this.client.updateEmployee(dto));
  }

  async deleteCompany(id: string): Promise<boolean> {
    const res = await lastValueFrom(this.client.deleteCompany({ id }));
    return res.value;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const res = await lastValueFrom(this.client.deleteEmployee({ id }));
    return res.value;
  }

  async getMyCompanys(userId: string): Promise<ICompany[]> {
    const res = await lastValueFrom(this.client.getMyCompanys({ userId }));
    return res.companies ?? [];
  }

  async getCompanyById(companyId: string): Promise<ICompany | null> {
    try {
      const res = await lastValueFrom(
        this.client.findCompanyById({ id: companyId }),
      );
      return res?.id ? res : null;
    } catch {
      return null;
    }
  }

  async getMyCompanyProfile(
    companyId: string,
    userId: string,
  ): Promise<IEmployee | null> {
    try {
      const res = await lastValueFrom(
        this.client.getMyCompanyProfile({ companyId, userId }),
      );
      return res?.id ? res : null;
    } catch {
      return null;
    }
  }

  async getCompanyMembers(companyId: string): Promise<IEmployee[]> {
    const res = await lastValueFrom(
      this.client.getCompanyMembers({ id: companyId }),
    );
    return res.employees ?? [];
  }
}
