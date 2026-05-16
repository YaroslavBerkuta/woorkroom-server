import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ConfigurationModule } from 'woorkroom/config';
import { join } from 'path';
import { GrpcUsersService } from './services/users-grpc.service';
import { GrpcAuthService } from './services/auth-grpc.service';
import { GrpcCompanysService } from './services/companys-grpc.service';
import { GrpcMediaService } from './services/media-grpc.service';
import { GrpcProjectsService } from './services/projects-grpc.service';

const grpcLoaderOptions = {
  longs: Number,
  defaults: true,
  arrays: true,
  objects: true,
  oneofs: true,
};

@Module({
  imports: [
    ConfigurationModule,
    ClientsModule.registerAsync([
      {
        name: 'USERS_GRPC_CLIENT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'users',
            protoPath: join(process.cwd(), 'proto', 'users.proto'),
            url: config.get<string>('grpc.users.url'),
            loader: grpcLoaderOptions,
          },
        }),
      },
      {
        name: 'AUTH_GRPC_CLIENT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth',
            protoPath: join(process.cwd(), 'proto', 'auth.proto'),
            url: config.get<string>('grpc.authorization.url'),
            loader: grpcLoaderOptions,
          },
        }),
      },
      {
        name: 'COMPANYS_GRPC_CLIENT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'companys',
            protoPath: join(process.cwd(), 'proto', 'companys.proto'),
            url: config.get<string>('grpc.companys.url'),
            loader: grpcLoaderOptions,
          },
        }),
      },
      {
        name: 'MEDIA_GRPC_CLIENT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'media',
            protoPath: join(process.cwd(), 'proto', 'media.proto'),
            url: config.get<string>('grpc.media.url'),
            loader: grpcLoaderOptions,
          },
        }),
      },
      {
        name: 'PROJECTS_GRPC_CLIENT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'projects',
            protoPath: join(process.cwd(), 'proto', 'projects.proto'),
            url: config.get<string>('grpc.projects.url'),
            loader: grpcLoaderOptions,
          },
        }),
      },
    ]),
  ],
  providers: [
    { provide: GrpcUsersService.name, useClass: GrpcUsersService },
    { provide: GrpcAuthService.name, useClass: GrpcAuthService },
    { provide: GrpcCompanysService.name, useClass: GrpcCompanysService },
    { provide: GrpcMediaService.name, useClass: GrpcMediaService },
    { provide: GrpcProjectsService.name, useClass: GrpcProjectsService },
  ],
  exports: [
    GrpcUsersService.name,
    GrpcAuthService.name,
    GrpcCompanysService.name,
    GrpcMediaService.name,
    GrpcProjectsService.name,
  ],
})
export class GrpcModule {}
