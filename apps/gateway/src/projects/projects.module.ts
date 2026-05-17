import { Module } from '@nestjs/common';
import { GrpcModule } from 'woorkroom/grpc';
import { ProjectsResolver } from '@/projects/resolvers';
import { ProjectDataloaderService } from '@/projects/dataloader/project-dataloader.service';

@Module({
  imports: [GrpcModule],
  providers: [ProjectsResolver, ProjectDataloaderService],
})
export class ProjectsModule {}
