import { Module } from '@nestjs/common';
import { GrpcModule } from 'woorkroom/grpc';
import { ActivityResolver } from './resolvers/activity.resolver';

@Module({
  imports: [GrpcModule],
  providers: [ActivityResolver],
})
export class ActivityModule {}
