import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export interface MongoSchemaDefinition {
  name: string;
  schema: unknown;
}

@Module({})
export class MongoModule {
  static forProjects(schemas: MongoSchemaDefinition[]): DynamicModule {
    return {
      module: MongoModule,
      imports: [
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            uri: config.get<string>('mongo.projects'),
          }),
        }),
        MongooseModule.forFeature(schemas),
      ],
      exports: [MongooseModule],
    };
  }

  static forMails(schemas: MongoSchemaDefinition[]): DynamicModule {
    return {
      module: MongoModule,
      imports: [
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            uri: config.get<string>('mongo.mails'),
          }),
        }),
        MongooseModule.forFeature(schemas),
      ],
      exports: [MongooseModule],
    };
  }
}
