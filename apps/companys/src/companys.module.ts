import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { DatabaseModule } from 'woorkroom/database';
import { RedisModule } from 'woorkroom/redis';
import { entities } from './entitys';
import { CompanysController, EmployeeController } from './controllers';
import { CompanyService, EmployeeService } from './services';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule.forCompany(entities),
    RedisModule,
  ],
  controllers: [CompanysController, EmployeeController],
  providers: [CompanyService, EmployeeService],
})
export class CompanysModule {}
