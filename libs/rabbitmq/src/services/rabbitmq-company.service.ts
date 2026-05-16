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
import { IRabbitmqCompanyService } from 'woorkroom/rabbitmq/types/interfaces/rabbitmq-company.service.interface';

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
          catchError((err: unknown) =>
            throwError(
              () =>
                new RpcException(
                  (err as Error)?.message || 'COMPANY_SERVICE error',
                ),
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
          catchError((err: unknown) =>
            throwError(
              () =>
                new RpcException(
                  (err as Error)?.message || 'COMPANY_SERVICE error',
                ),
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
          catchError((err: unknown) =>
            throwError(
              () =>
                new RpcException(
                  (err as Error)?.message || 'COMPANY_SERVICE error',
                ),
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
          catchError((err: unknown) =>
            throwError(
              () =>
                new RpcException(
                  (err as Error)?.message || 'COMPANY_SERVICE error',
                ),
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
          catchError((err: unknown) =>
            throwError(
              () =>
                new RpcException(
                  (err as Error)?.message || 'COMPANY_SERVICE error',
                ),
            ),
          ),
        ),
    );
  }

  public async getCompanyById(companyId: string): Promise<ICompany | null> {
    return lastValueFrom(
      this.companyService
        .send<ICompany | null>(EMessageRmqp.FIND_COMPANY_BY_ID, {
          id: companyId,
        })
        .pipe(
          timeout(10_000),
          catchError((err: unknown) =>
            throwError(
              () =>
                new RpcException(
                  (err as Error)?.message || 'COMPANY_SERVICE error',
                ),
            ),
          ),
        ),
    );
  }

  public async getMyCompanyProfile(
    companyId: string,
    userId: string,
  ): Promise<IEmployee | null> {
    return lastValueFrom(
      this.companyService
        .send<IEmployee | null>(EMessageRmqp.GET_MY_COMPANY_PROFILE, {
          companyId,
          userId,
        })
        .pipe(
          timeout(10_000),
          catchError((err: unknown) =>
            throwError(
              () =>
                new RpcException(
                  (err as Error)?.message || 'COMPANY_SERVICE error',
                ),
            ),
          ),
        ),
    );
  }
}
