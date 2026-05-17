import { Module } from '@nestjs/common';
import { HealthModule } from 'woorkroom/health';
import { CompanysHealthController } from './health.controller';

@Module({
  imports: [HealthModule],
  controllers: [CompanysHealthController],
})
export class CompanysHealthModule {}
