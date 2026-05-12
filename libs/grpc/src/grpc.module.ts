import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ConfigurationModule } from 'woorkroom/config';
import { join } from 'path';
import { GrpcUsersService } from './services/users-grpc.service';
import { GrpcAuthService } from './services/auth-grpc.service';
import { GrpcCompanysService } from './services/companys-grpc.service';

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
    ]),
  ],
  providers: [
    { provide: GrpcUsersService.name, useClass: GrpcUsersService },
    { provide: GrpcAuthService.name, useClass: GrpcAuthService },
    { provide: GrpcCompanysService.name, useClass: GrpcCompanysService },
  ],
  exports: [
    GrpcUsersService.name,
    GrpcAuthService.name,
    GrpcCompanysService.name,
  ],
})
export class GrpcModule {}
