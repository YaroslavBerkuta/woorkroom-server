import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { DatabaseModule } from 'woorkroom/database';
import { entities } from './entitys';
import { ProjectController } from './controllers';
import { ProjectService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entitys/project.entity';
import { ProjectMember } from './entitys/project-member.entity';
import { ProjectFile } from './entitys/project-file.entity';
import { ProjectLink } from './entitys/project-link.entity';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule.forProjects(entities),
    TypeOrmModule.forFeature([Project, ProjectMember, ProjectFile, ProjectLink]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectsModule {}
