import { Module } from '@nestjs/common';
import { RabbitmqModule } from 'woorkroom/rabbitmq';
import { UsersModule } from '../users';
import { CompanysModule } from '../companys';
import { UserCompanyResolver } from './resolvers';

@Module({
  imports: [RabbitmqModule, UsersModule, CompanysModule],
  providers: [UserCompanyResolver],
})
export class CompanyUserModule {}
