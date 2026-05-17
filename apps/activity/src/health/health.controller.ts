import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { MongoHealthIndicator, RabbitMqHealthIndicator } from 'woorkroom/health';

@Controller('health')
export class ActivityHealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongo: MongoHealthIndicator,
    private readonly rabbitmq: RabbitMqHealthIndicator,
    private readonly config: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const mongoUri = this.config.get<string>('mongo.activity') || '';
    return this.health.check([
      () => this.mongo.isHealthy('mongodb', mongoUri),
      () => this.rabbitmq.isHealthy('rabbitmq'),
    ]);
  }
}
