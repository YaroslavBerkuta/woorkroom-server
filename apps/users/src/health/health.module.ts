import { Module } from '@nestjs/common';
import { HealthModule } from 'woorkroom/health';
import { UsersHealthController } from './health.controller';

@Module({
  imports: [HealthModule],
  controllers: [UsersHealthController],
})
export class UsersHealthModule {}
