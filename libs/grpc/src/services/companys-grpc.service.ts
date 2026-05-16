import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import {
  CreateCompanyDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  ICompany,
  IEmployee,
} from 'shared';
import { IGrpcCompanyService } from '../types';

interface CompanysGrpcClient {
  createCompany(data: any): Observable<any>;
  updateCompany(data: any): Observable<any>;
  deleteCompany(data: any): Observable<any>;
  findCompanyById(data: any): Observable<any>;
  createEmployee(data: any): Observable<any>;
  updateEmployee(data: any): Observable<any>;
  deleteEmployee(data: any): Observable<any>;
  getMyCompanys(data: any): Observable<any>;
  getMyCompanyProfile(data: any): Observable<any>;
  getCompanyMembers(data: any): Observable<any>;
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
      return res?.id ? (res as ICompany) : null;
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
      return res?.id ? (res as IEmployee) : null;
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
