import { Module } from '@nestjs/common';
import { RabbitmqModule } from 'woorkroom/rabbitmq';
import { CompanysResolver, EmployeeResolver } from './resolvers';

@Module({
  imports: [RabbitmqModule],
  providers: [CompanysResolver, EmployeeResolver],
  exports: [CompanysResolver, EmployeeResolver],
})
export class CompanysModule {}
