import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users';
import { AuthModule } from './auth';
import { CompanysModule } from './companys';
import { CompanyUserModule } from './companyUser';
import { ConfigurationModule } from 'woorkroom/config';

@Module({
  imports: [
    ConfigurationModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
    }),
    UsersModule,
    AuthModule,
    CompanysModule,
    CompanyUserModule,
  ],
})
export class AppModule {}
