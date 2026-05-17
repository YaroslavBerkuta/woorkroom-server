import { Module } from '@nestjs/common';
import { HealthModule } from 'woorkroom/health';
import { GatewayHealthController } from './health.controller';

@Module({
  imports: [HealthModule],
  controllers: [GatewayHealthController],
})
export class GatewayHealthModule {}
