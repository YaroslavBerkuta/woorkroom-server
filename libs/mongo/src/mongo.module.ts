import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule, ModelDefinition } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({})
export class MongoModule {
  static forProjects(schemas: ModelDefinition[]): DynamicModule {
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

  static forMails(schemas: ModelDefinition[]): DynamicModule {
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
