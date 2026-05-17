import { Module } from '@nestjs/common';
import { HealthModule } from 'woorkroom/health';
import { AuthorizationHealthController } from './health.controller';

@Module({
  imports: [HealthModule],
  controllers: [AuthorizationHealthController],
})
export class AuthorizationHealthModule {}
