import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { DatabaseModule } from 'woorkroom/database';
import { entities } from './entitys';
import { CompanysController } from './controllers';
import { CompanyService, EmployeeService } from './services';

@Module({
  imports: [ConfigurationModule, DatabaseModule.forCompany(entities)],
  controllers: [CompanysController],
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
