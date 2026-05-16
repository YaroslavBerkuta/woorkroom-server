import { Module } from '@nestjs/common';
import { GrpcModule } from 'woorkroom/grpc';
import { ProjectsResolver } from './resolvers';

@Module({
  imports: [GrpcModule],
  providers: [ProjectsResolver],
})
export class ProjectsModule {}
