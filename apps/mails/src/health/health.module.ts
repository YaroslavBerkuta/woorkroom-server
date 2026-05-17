import { Module } from '@nestjs/common';
import { HealthModule } from 'woorkroom/health';
import { MailsHealthController } from './health.controller';

@Module({
  imports: [HealthModule],
  controllers: [MailsHealthController],
})
export class MailsHealthModule {}
