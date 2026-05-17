import { Module } from '@nestjs/common';
import { GrpcModule } from 'woorkroom/grpc';
import { ProjectsResolver } from './resolvers';
import { ProjectDataloaderService } from './dataloader/project-dataloader.service';

@Module({
  imports: [GrpcModule],
  providers: [ProjectsResolver, ProjectDataloaderService],
})
export class ProjectsModule {}
