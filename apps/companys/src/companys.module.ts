import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { DatabaseModule } from 'woorkroom/database';
import { entities } from './entitys';
import { CompanysController, EmployeeController } from './controllers';
import { CompanyService, EmployeeService } from './services';

@Module({
  imports: [ConfigurationModule, DatabaseModule.forCompany(entities)],
  controllers: [CompanysController, EmployeeController],
  providers: [
    {
      provide: CompanyService.name,
      useClass: CompanyService,
    },
    {
      provide: EmployeeService.name,
      useClass: EmployeeService,
    },
  ],
})
export class CompanysModule {}
