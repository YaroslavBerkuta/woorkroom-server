import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigurationModule } from 'woorkroom/config';
import { DatabaseModule } from 'woorkroom/database';
import { RedisModule } from 'woorkroom/redis';
import { entities } from './entitys';
import { Project } from './entitys/project.entity';
import { ProjectMember } from './entitys/project-member.entity';
import { ProjectController } from './controllers';
import { ProjectService } from './services';
import { ProjectFile, ProjectFileSchema, ProjectLink, ProjectLinkSchema } from './schemas';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule.forProjects(entities),
    TypeOrmModule.forFeature([Project, ProjectMember]),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongo.projects'),
      }),
    }),
    MongooseModule.forFeature([
      { name: ProjectFile.name, schema: ProjectFileSchema },
      { name: ProjectLink.name, schema: ProjectLinkSchema },
    ]),
    RedisModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectsModule {}
