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
import { RabbitmqCompanyServiceInterface } from '../types';

@Injectable()
export class RabbitmqCompanyService implements RabbitmqCompanyServiceInterface {
  constructor(
    @Inject('COMPANY_SERVICE') private readonly companyService: ClientProxy,
  ) {}

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
}
