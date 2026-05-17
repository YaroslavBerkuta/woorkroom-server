import { Module } from '@nestjs/common';
import { UserQueryResolver } from '@/users/resolvers';
import { GrpcModule } from 'woorkroom/grpc';

@Module({
  imports: [GrpcModule],
  providers: [UserQueryResolver],
})
export class UsersModule {}
