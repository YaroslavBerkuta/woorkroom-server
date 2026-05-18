import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

const sslOptions =
  process.env.NODE_ENV === 'production'
    ? { ssl: { rejectUnauthorized: false } }
    : {};

@Module({})
export class DatabaseModule {
  static forUsers(entities: any[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService): TypeOrmModuleOptions => {
            const db =
              config.get<Record<string, unknown>>('postgres.users') ?? {};
            return {
              ...db,
              ...sslOptions,
              synchronize: true,
              entities,
            };
          },
        }),
        TypeOrmModule.forFeature(entities),
      ],
      exports: [TypeOrmModule],
    };
  }

  static forCompany(entities: any[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService): TypeOrmModuleOptions => {
            const db =
              config.get<Record<string, unknown>>('postgres.companys') ?? {};
            return {
              ...db,
              ...sslOptions,
              synchronize: true,
              entities,
            };
          },
        }),
        TypeOrmModule.forFeature(entities),
      ],
      exports: [TypeOrmModule],
    };
  }

  static forProjects(entities: any[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService): TypeOrmModuleOptions => {
            const db =
              config.get<Record<string, unknown>>('postgres.projects') ?? {};
            return {
              ...db,
              ...sslOptions,
              synchronize: true,
              entities,
            };
          },
        }),
        TypeOrmModule.forFeature(entities),
      ],
      exports: [TypeOrmModule],
    };
  }
}
