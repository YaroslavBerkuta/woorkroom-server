import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Request, Response } from 'express';
import { UsersModule } from './users';
import { AuthModule } from './auth';
import { CompanysModule } from './companys';
import { CompanyUserModule } from './companyUser';
import { ProjectsModule } from './projects';
import { AuditModule } from './audit/audit.module';
import { ConfigurationModule } from 'woorkroom/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigurationModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      fieldResolverEnhancers: ['guards'],
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
    UsersModule,
    AuthModule,
    CompanysModule,
    CompanyUserModule,
    ProjectsModule,
    AuditModule,
  ],
})
export class AppModule {}
