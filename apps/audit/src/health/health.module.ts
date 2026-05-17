import { Module } from '@nestjs/common';
import { HealthModule } from 'woorkroom/health';
import { AuditHealthController } from './health.controller';

@Module({
  imports: [HealthModule],
  controllers: [AuditHealthController],
})
export class AuditHealthModule {}
