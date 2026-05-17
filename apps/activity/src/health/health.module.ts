import { Module } from '@nestjs/common';
import { HealthModule } from 'woorkroom/health';
import { ActivityHealthController } from './health.controller';

@Module({
  imports: [HealthModule],
  controllers: [ActivityHealthController],
})
export class ActivityHealthModule {}
