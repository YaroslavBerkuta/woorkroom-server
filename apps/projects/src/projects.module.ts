import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from 'woorkroom/config';
import { DatabaseModule } from 'woorkroom/database';
import { MongoModule } from 'woorkroom/mongo';
import { RedisModule } from 'woorkroom/redis';
import { RabbitmqModule } from 'woorkroom/rabbitmq';
import { entities } from './entitys';
import { Project } from './entitys/project.entity';
import { ProjectMember } from './entitys/project-member.entity';
import { ProjectController } from './controllers';
import { ProjectService } from './services';
import {
  ProjectFile,
  ProjectFileSchema,
  ProjectLink,
  ProjectLinkSchema,
} from './schemas';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule.forProjects(entities),
    TypeOrmModule.forFeature([Project, ProjectMember]),
    MongoModule.forProjects([
      { name: ProjectFile.name, schema: ProjectFileSchema },
      { name: ProjectLink.name, schema: ProjectLinkSchema },
    ]),
    RedisModule,
    RabbitmqModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectsModule {}
