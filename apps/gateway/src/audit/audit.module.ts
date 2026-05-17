import { Module } from '@nestjs/common';
import { GrpcModule } from 'woorkroom/grpc';
import { AuditResolver } from './resolvers/audit.resolver';

@Module({
  imports: [GrpcModule],
  providers: [AuditResolver],
})
export class AuditModule {}
