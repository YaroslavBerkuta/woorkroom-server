import { Module } from '@nestjs/common';
import { GrpcModule } from 'woorkroom/grpc';
import { CompanysResolver } from './resolvers';

@Module({
  imports: [GrpcModule],
  providers: [CompanysResolver],
  exports: [CompanysResolver],
})
export class CompanysModule {}
