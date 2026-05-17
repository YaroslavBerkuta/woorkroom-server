import { Module } from '@nestjs/common';
import { GrpcModule } from 'woorkroom/grpc';
import { UsersModule } from '@/users';
import { CompanysModule } from '@/companys';
import { UserCompanyResolver } from '@/companyUser/resolvers';

@Module({
  imports: [GrpcModule, UsersModule, CompanysModule],
  providers: [UserCompanyResolver],
})
export class CompanyUserModule {}
