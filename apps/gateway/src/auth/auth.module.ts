import { Module } from '@nestjs/common';
import { AuthResolver } from './resolvers';
import { GrpcModule } from 'woorkroom/grpc';

@Module({
  imports: [GrpcModule],
  providers: [AuthResolver],
})
export class AuthModule {}
