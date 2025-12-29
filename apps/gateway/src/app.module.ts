import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users';
import { AuthModule } from './auth';
import { CompanysModule } from './companys';
import { CompanyUserModule } from './companyUser';
import { ConfigurationModule } from 'woorkroom/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigurationModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      introspection: true,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
    }),
    UsersModule,
    AuthModule,
    CompanysModule,
    CompanyUserModule,
  ],
})
export class AppModule {}
