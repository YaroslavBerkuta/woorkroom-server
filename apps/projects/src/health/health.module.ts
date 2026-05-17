import { Module } from '@nestjs/common';
import { HealthModule } from 'woorkroom/health';
import { ProjectsHealthController } from './health.controller';

@Module({
  imports: [HealthModule],
  controllers: [ProjectsHealthController],
})
export class ProjectsHealthModule {}
