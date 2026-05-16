import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'woorkroom/config';
import { DatabaseModule } from 'woorkroom/database';
import { entities } from './entitys';
import { ProjectController } from './controllers';
import { ProjectService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entitys/project.entity';
import { ProjectMember } from './entitys/project-member.entity';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule.forProjects(entities),
    TypeOrmModule.forFeature([Project, ProjectMember]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectsModule {}
