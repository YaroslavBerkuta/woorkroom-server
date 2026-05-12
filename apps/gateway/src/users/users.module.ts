import { Module } from '@nestjs/common';
import { UserQueryResolver } from './resolvers';
import { GrpcModule } from 'woorkroom/grpc';

@Module({
  imports: [GrpcModule],
  providers: [UserQueryResolver],
})
export class UsersModule {}
