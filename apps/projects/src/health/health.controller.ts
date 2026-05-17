import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import {
  MongoHealthIndicator,
  PostgresHealthIndicator,
  RabbitMqHealthIndicator,
  RedisHealthIndicator,
} from 'woorkroom/health';

@Controller('health')
export class ProjectsHealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly postgres: PostgresHealthIndicator,
    private readonly mongo: MongoHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    private readonly rabbitmq: RabbitMqHealthIndicator,
    private readonly config: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const mongoUri = this.config.get<string>('mongo.projects') || '';
    return this.health.check([
      () => this.postgres.isHealthy('postgres', 'projects'),
      () => this.mongo.isHealthy('mongodb', mongoUri),
      () => this.redis.isHealthy('redis'),
      () => this.rabbitmq.isHealthy('rabbitmq'),
    ]);
  }
}
