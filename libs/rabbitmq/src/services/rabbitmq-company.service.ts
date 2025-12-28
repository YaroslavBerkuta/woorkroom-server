import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError, timeout } from 'rxjs';
import {
  CreateCompanyDto,
  CreateEmployeeDto,
  EMessageRmqp,
  ICompany,
  IEmployee,
} from 'shared';
import { IRabbitmqCompanyService } from '../types';

@Injectable()
export class RabbitmqCompanyService implements IRabbitmqCompanyService {
  constructor(
    @Inject('COMPANY_SERVICE') private readonly companyService: ClientProxy,
  ) {}

  public async deleteCompany(id: string) {
    return lastValueFrom(
      this.companyService
        .send<boolean>(EMessageRmqp.DELETE_COMPANY, { id })
        .pipe(
          timeout(10_000),
          catchError((err) =>
            throwError(
              () => new RpcException(err?.message || 'COMPANY_SERVICE error'),
            ),
          ),
        ),
    );
  }
  public async deleteEmployee(id: string) {
    return lastValueFrom(
      this.companyService
        .send<boolean>(EMessageRmqp.DELETE_EMPLOYEE, { id })
        .pipe(
          timeout(10_000),
          catchError((err) =>
            throwError(
              () => new RpcException(err?.message || 'COMPANY_SERVICE error'),
            ),
          ),
        ),
    );
  }

  public async createCompany(company: CreateCompanyDto): Promise<ICompany> {
    return lastValueFrom(
      this.companyService
        .send<ICompany>(EMessageRmqp.CREATE_COMPANY, company)
        .pipe(
          timeout(10_000),
          catchError((err) =>
            throwError(
              () => new RpcException(err?.message || 'COMPANY_SERVICE error'),
            ),
          ),
        ),
    );
  }

  public async createEmployee(employee: CreateEmployeeDto) {
    return lastValueFrom(
      this.companyService
        .send<IEmployee>(EMessageRmqp.CREATE_EMPLOYEE, employee)
        .pipe(
          timeout(10_000),
          catchError((err) =>
            throwError(
              () => new RpcException(err?.message || 'COMPANY_SERVICE error'),
            ),
          ),
        ),
    );
  }

  public async getMyCompanys(userId: string): Promise<ICompany[]> {
    return lastValueFrom(
      this.companyService
        .send<ICompany[]>(EMessageRmqp.GET_MY_COMPANYS, { userId })
        .pipe(
          timeout(10_000),
          catchError((err) =>
            throwError(
              () => new RpcException(err?.message || 'COMPANY_SERVICE error'),
            ),
          ),
        ),
    );
  }
}
