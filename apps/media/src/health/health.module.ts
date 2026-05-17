import { Module } from '@nestjs/common';
import { HealthModule } from 'woorkroom/health';
import { MediaHealthController } from './health.controller';

@Module({
  imports: [HealthModule],
  controllers: [MediaHealthController],
})
export class MediaHealthModule {}
